"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReceptionist = exports.updateReceptionist = exports.createReceptionist = exports.getReceptionists = void 0;
const Receptionist_1 = __importDefault(require("../models/Receptionist"));
// @desc    Get all receptionists
// @route   GET /api/receptionists
// @access  Private/SuperAdmin
const getReceptionists = async (req, res) => {
    try {
        const receptionists = await Receptionist_1.default.find({}).populate('hotelId', 'name');
        res.json(receptionists);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getReceptionists = getReceptionists;
// @desc    Create a receptionist
// @route   POST /api/receptionists
// @access  Private/SuperAdmin
const createReceptionist = async (req, res) => {
    const { name, email, password, phone, hotelId } = req.body;
    try {
        const receptionistExists = await Receptionist_1.default.findOne({ email });
        if (receptionistExists) {
            res.status(400).json({ message: 'Receptionist already exists' });
            return;
        }
        const hotelExists = await Receptionist_1.default.findOne({ hotelId });
        if (hotelExists) {
            res.status(400).json({ message: 'A receptionist is already assigned to this hotel' });
            return;
        }
        const receptionist = await Receptionist_1.default.create({
            name,
            email,
            password,
            phone,
            hotelId,
        });
        if (receptionist) {
            res.status(201).json({
                _id: receptionist._id,
                name: receptionist.name,
                email: receptionist.email,
                hotelId: receptionist.hotelId,
                role: receptionist.role,
            });
        }
        else {
            res.status(400).json({ message: 'Invalid receptionist data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createReceptionist = createReceptionist;
// @desc    Update a receptionist
// @route   PUT /api/receptionists/:id
// @access  Private/SuperAdmin
const updateReceptionist = async (req, res) => {
    try {
        const receptionist = await Receptionist_1.default.findById(req.params.id);
        if (receptionist) {
            receptionist.name = req.body.name || receptionist.name;
            receptionist.email = req.body.email || receptionist.email;
            receptionist.phone = req.body.phone || receptionist.phone;
            if (req.body.hotelId) {
                // check if another receptionist is already assigned to this new hotel
                if (req.body.hotelId !== receptionist.hotelId.toString()) {
                    const hotelExists = await Receptionist_1.default.findOne({ hotelId: req.body.hotelId });
                    if (hotelExists) {
                        res.status(400).json({ message: 'A receptionist is already assigned to this hotel' });
                        return;
                    }
                }
                receptionist.hotelId = req.body.hotelId;
            }
            if (req.body.password) {
                receptionist.password = req.body.password;
            }
            const updatedReceptionist = await receptionist.save();
            res.json({
                _id: updatedReceptionist._id,
                name: updatedReceptionist.name,
                email: updatedReceptionist.email,
                hotelId: updatedReceptionist.hotelId,
                role: updatedReceptionist.role,
            });
        }
        else {
            res.status(404).json({ message: 'Receptionist not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateReceptionist = updateReceptionist;
// @desc    Delete a receptionist
// @route   DELETE /api/receptionists/:id
// @access  Private/SuperAdmin
const deleteReceptionist = async (req, res) => {
    try {
        const receptionist = await Receptionist_1.default.findById(req.params.id);
        if (receptionist) {
            await receptionist.deleteOne();
            res.json({ message: 'Receptionist removed' });
        }
        else {
            res.status(404).json({ message: 'Receptionist not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteReceptionist = deleteReceptionist;
