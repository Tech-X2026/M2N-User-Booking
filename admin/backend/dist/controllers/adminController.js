"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAdmin2FA = exports.deleteAdmin = exports.updateAdmin = exports.createAdmin = exports.getAdmins = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
// @desc    Get all admins
// @route   GET /api/admin
// @access  Private/Superadmin
const getAdmins = async (req, res) => {
    try {
        const admins = await Admin_1.default.find({}).select('-password');
        res.json(admins);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAdmins = getAdmins;
// @desc    Create an admin
// @route   POST /api/admin
// @access  Private/Superadmin
const createAdmin = async (req, res) => {
    try {
        const { name, email, password, phone, permissions } = req.body;
        const adminExists = await Admin_1.default.findOne({ email });
        if (adminExists) {
            res.status(400).json({ message: 'Admin already exists' });
            return;
        }
        const admin = await Admin_1.default.create({
            name,
            email,
            password,
            phone,
            permissions: permissions || [],
        });
        if (admin) {
            res.status(201).json({
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                phone: admin.phone,
                permissions: admin.permissions,
            });
        }
        else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createAdmin = createAdmin;
// @desc    Update admin (email, password, name)
// @route   PUT /api/admin/:id
// @access  Private/Superadmin
const updateAdmin = async (req, res) => {
    try {
        const admin = await Admin_1.default.findById(req.params.id);
        if (admin) {
            admin.name = req.body.name || admin.name;
            admin.email = req.body.email || admin.email;
            admin.phone = req.body.phone || admin.phone;
            if (req.body.permissions !== undefined) {
                admin.permissions = req.body.permissions;
            }
            if (req.body.password) {
                admin.password = req.body.password;
            }
            const updatedAdmin = await admin.save();
            res.json({
                id: updatedAdmin._id,
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
        res.status(500).json({ message: error.message });
    }
};
exports.updateAdmin = updateAdmin;
// @desc    Delete admin
// @route   DELETE /api/admin/:id
// @access  Private/Superadmin
const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin_1.default.findById(req.params.id);
        if (admin) {
            await admin.deleteOne();
            res.json({ message: 'Admin removed' });
        }
        else {
            res.status(404).json({ message: 'Admin not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteAdmin = deleteAdmin;
// @desc    Reset 2FA for an admin
// @route   POST /api/admin/:id/reset-2fa
// @access  Private/Superadmin
const resetAdmin2FA = async (req, res) => {
    try {
        const admin = await Admin_1.default.findById(req.params.id);
        if (admin) {
            admin.twoFactorEnabled = false;
            admin.twoFactorVerified = false;
            admin.twoFactorSecret = undefined;
            admin.twoFactorBackupCodes = [];
            admin.twoFactorSetupCompletedAt = undefined;
            await admin.save();
            res.json({ message: '2FA has been reset for this admin' });
        }
        else {
            res.status(404).json({ message: 'Admin not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.resetAdmin2FA = resetAdmin2FA;
