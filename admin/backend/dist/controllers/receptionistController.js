"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceptionist = exports.updateReceptionist = exports.createReceptionist = exports.getReceptionists = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../utils/prisma"));
// @desc    Get all receptionists
// @route   GET /api/receptionists
// @access  Private/SuperAdmin
const getReceptionists = async (req, res) => {
    try {
        const receptionists = await prisma_1.default.receptionist.findMany({
            include: {
                hotel: { select: { name: true } }
            }
        });
        const formattedReceptionists = receptionists.map(r => ({
            ...r,
            _id: r.id,
            hotelId: r.hotel
        }));
        res.json(formattedReceptionists);
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.getReceptionists = getReceptionists;
// @desc    Create a receptionist
// @route   POST /api/receptionists
// @access  Private/SuperAdmin
const createReceptionist = async (req, res) => {
    const { name, email, password, phone, hotelId, permissions } = req.body;
    try {
        const receptionistExists = await prisma_1.default.receptionist.findUnique({ where: { email } });
        if (receptionistExists) {
            res.status(400).json({ message: 'Receptionist already exists' });
            return;
        }
        const hotelExists = await prisma_1.default.receptionist.findUnique({ where: { hotelId } });
        if (hotelExists) {
            res.status(400).json({ message: 'A receptionist is already assigned to this hotel' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const receptionist = await prisma_1.default.receptionist.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                hotelId,
                permissions: permissions || [],
            }
        });
        res.status(201).json({
            _id: receptionist.id,
            name: receptionist.name,
            email: receptionist.email,
            hotelId: receptionist.hotelId,
            role: receptionist.role,
            permissions: receptionist.permissions,
        });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.createReceptionist = createReceptionist;
// @desc    Update a receptionist
// @route   PUT /api/receptionists/:id
// @access  Private/SuperAdmin
const updateReceptionist = async (req, res) => {
    try {
        const { id } = req.params;
        const receptionist = await prisma_1.default.receptionist.findUnique({ where: { id } });
        if (receptionist) {
            const updateData = {};
            if (req.body.name)
                updateData.name = req.body.name;
            if (req.body.email)
                updateData.email = req.body.email;
            if (req.body.phone)
                updateData.phone = req.body.phone;
            if (req.body.permissions !== undefined)
                updateData.permissions = req.body.permissions;
            if (req.body.hotelId) {
                if (req.body.hotelId !== receptionist.hotelId) {
                    const hotelExists = await prisma_1.default.receptionist.findUnique({ where: { hotelId: req.body.hotelId } });
                    if (hotelExists) {
                        res.status(400).json({ message: 'A receptionist is already assigned to this hotel' });
                        return;
                    }
                }
                updateData.hotelId = req.body.hotelId;
            }
            if (req.body.password) {
                updateData.password = await bcryptjs_1.default.hash(req.body.password, 10);
            }
            const updatedReceptionist = await prisma_1.default.receptionist.update({
                where: { id },
                data: updateData
            });
            res.json({
                _id: updatedReceptionist.id,
                name: updatedReceptionist.name,
                email: updatedReceptionist.email,
                hotelId: updatedReceptionist.hotelId,
                role: updatedReceptionist.role,
                permissions: updatedReceptionist.permissions,
            });
        }
        else {
            res.status(404).json({ message: 'Receptionist not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.updateReceptionist = updateReceptionist;
// @desc    Delete a receptionist
// @route   DELETE /api/receptionists/:id
// @access  Private/SuperAdmin
const deleteReceptionist = async (req, res) => {
    try {
        const { id } = req.params;
        const receptionist = await prisma_1.default.receptionist.findUnique({ where: { id } });
        if (receptionist) {
            await prisma_1.default.receptionist.delete({ where: { id } });
            res.json({ message: 'Receptionist removed' });
        }
        else {
            res.status(404).json({ message: 'Receptionist not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.deleteReceptionist = deleteReceptionist;
