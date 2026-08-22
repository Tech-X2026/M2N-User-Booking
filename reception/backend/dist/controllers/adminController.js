"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAdmin2FA = exports.deleteAdmin = exports.updateAdmin = exports.createAdmin = exports.getAdmins = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../utils/prisma"));
// @desc    Get all admins
// @route   GET /api/admin
// @access  Private/Superadmin
const getAdmins = async (req, res) => {
    try {
        const admins = await prisma_1.default.admin.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                permissions: true,
                twoFactorEnabled: true,
                twoFactorVerified: true,
                createdAt: true,
                updatedAt: true
            }
        });
        // Frontend might expect _id
        const formattedAdmins = admins.map(admin => ({
            ...admin,
            _id: admin.id
        }));
        res.json(formattedAdmins);
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.getAdmins = getAdmins;
// @desc    Create an admin
// @route   POST /api/admin
// @access  Private/Superadmin
const createAdmin = async (req, res) => {
    try {
        const { name, email, password, phone, permissions } = req.body;
        const adminExists = await prisma_1.default.admin.findUnique({ where: { email } });
        if (adminExists) {
            res.status(400).json({ message: 'Admin already exists' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const admin = await prisma_1.default.admin.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                permissions: permissions || [],
            }
        });
        res.status(201).json({
            id: admin.id,
            _id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            phone: admin.phone,
            permissions: admin.permissions,
        });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.createAdmin = createAdmin;
// @desc    Update admin (email, password, name)
// @route   PUT /api/admin/:id
// @access  Private/Superadmin
const updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await prisma_1.default.admin.findUnique({ where: { id: adminId } });
        if (admin) {
            const updateData = {};
            if (req.body.name)
                updateData.name = req.body.name;
            if (req.body.email)
                updateData.email = req.body.email;
            if (req.body.phone)
                updateData.phone = req.body.phone;
            if (req.body.permissions !== undefined)
                updateData.permissions = req.body.permissions;
            if (req.body.password) {
                updateData.password = await bcryptjs_1.default.hash(req.body.password, 10);
            }
            const updatedAdmin = await prisma_1.default.admin.update({
                where: { id: adminId },
                data: updateData
            });
            res.json({
                id: updatedAdmin.id,
                _id: updatedAdmin.id,
                name: updatedAdmin.name,
                email: updatedAdmin.email,
                role: updatedAdmin.role,
                phone: updatedAdmin.phone,
                permissions: updatedAdmin.permissions,
            });
        }
        else {
            res.status(404).json({ message: 'Admin not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.updateAdmin = updateAdmin;
// @desc    Delete admin
// @route   DELETE /api/admin/:id
// @access  Private/Superadmin
const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await prisma_1.default.admin.findUnique({ where: { id: adminId } });
        if (admin) {
            await prisma_1.default.admin.delete({ where: { id: adminId } });
            res.json({ message: 'Admin removed' });
        }
        else {
            res.status(404).json({ message: 'Admin not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.deleteAdmin = deleteAdmin;
// @desc    Reset 2FA for an admin
// @route   POST /api/admin/:id/reset-2fa
// @access  Private/Superadmin
const resetAdmin2FA = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await prisma_1.default.admin.findUnique({ where: { id: adminId } });
        if (admin) {
            await prisma_1.default.admin.update({
                where: { id: adminId },
                data: {
                    twoFactorEnabled: false,
                    twoFactorVerified: false,
                    twoFactorSecret: null,
                    twoFactorBackupCodes: [],
                    twoFactorSetupCompletedAt: null
                }
            });
            res.json({ message: '2FA has been reset for this admin' });
        }
        else {
            res.status(404).json({ message: 'Admin not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.resetAdmin2FA = resetAdmin2FA;
