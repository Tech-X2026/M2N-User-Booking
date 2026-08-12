"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectAction = exports.approveAction = exports.restoreHotel = exports.deleteHotel = exports.updateHotel = exports.getHotels = exports.createHotel = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Hotel_1 = __importDefault(require("../models/Hotel"));
const sendEmail_1 = require("../utils/sendEmail");
// @desc    Create a new hotel
// @route   POST /api/hotels
// @access  Private (Admin)
const createHotel = async (req, res) => {
    try {
        const { name, city, state, type, tagline, address, lat, lng, description } = req.body;
        // Type casting to handle Multer's file array
        const files = req.files;
        const images = files ? files.map(file => file.path) : [];
        const newHotel = await Hotel_1.default.create({
            name,
            city,
            state,
            type,
            tagline,
            address,
            coords: {
                lat: Number(lat),
                lng: Number(lng)
            },
            description,
            images,
            // @ts-ignore (Assuming req.user is populated by auth middleware)
            addedBy: req.user?._id
        });
        res.status(201).json(newHotel);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.createHotel = createHotel;
// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Private (Admin)
const getHotels = async (req, res) => {
    try {
        const { archived } = req.query;
        const filter = archived === 'true' ? { isArchived: true } : { isArchived: { $ne: true } };
        // If no query is provided (or just getting all), maybe we want everything?
        // We will follow the global categories pattern: if archived=true, return archived, else return non-archived.
        // If we want all, we could pass archived=all, but let's stick to true/false.
        if (archived === 'all') {
            delete filter.isArchived;
        }
        const hotels = await Hotel_1.default.find(filter).populate('addedBy', 'name email');
        res.json(hotels);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.getHotels = getHotels;
// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private (Admin)
const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel_1.default.findById(id);
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }
        const { name, city, state, type, tagline, address, lat, lng, description } = req.body;
        const files = req.files;
        const newImages = files && files.length > 0 ? files.map(file => file.path) : [];
        hotel.name = name || hotel.name;
        hotel.city = city || hotel.city;
        hotel.state = state || hotel.state;
        hotel.type = type || hotel.type;
        hotel.tagline = tagline || hotel.tagline;
        hotel.address = address || hotel.address;
        if (lat !== undefined && lng !== undefined) {
            hotel.coords = {
                lat: Number(lat),
                lng: Number(lng)
            };
        }
        hotel.description = description || hotel.description;
        if (newImages.length > 0) {
            hotel.images = [...hotel.images, ...newImages];
        }
        const updatedHotel = await hotel.save();
        res.json(updatedHotel);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.updateHotel = updateHotel;
// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Admin)
const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel_1.default.findById(id);
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }
        if (req.user && req.user.role === 'superadmin') {
            hotel.isArchived = true;
            await hotel.save();
            res.json({ message: 'Hotel archived successfully.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ hotelId: id, action: 'delete' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const approveUrl = `${process.env.API_URL || 'http://localhost:5000/api'}/hotels/action/approve/${token}`;
        const rejectUrl = `${process.env.API_URL || 'http://localhost:5000/api'}/hotels/action/reject/${token}`;
        const message = `
      <h2>Hotel Deletion Request</h2>
      <p>A request has been made to delete the hotel: <strong>${hotel.name}</strong>.</p>
      <p>Please approve or reject this request by clicking one of the links below:</p>
      <br />
      <a href="${approveUrl}" style="padding:10px 20px; background-color:green; color:white; text-decoration:none; border-radius:5px;">Accept Deletion</a>
      &nbsp;&nbsp;&nbsp;
      <a href="${rejectUrl}" style="padding:10px 20px; background-color:red; color:white; text-decoration:none; border-radius:5px;">Reject Deletion</a>
    `;
        await (0, sendEmail_1.sendEmail)({
            email: 'm2n.hotel@gmail.com',
            subject: `Approval Required: Delete Hotel ${hotel.name}`,
            message
        });
        res.json({ message: 'Approval email sent for deletion.' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.deleteHotel = deleteHotel;
// @desc    Initiate restore hotel
// @route   POST /api/hotels/:id/restore
// @access  Private (Admin)
const restoreHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel_1.default.findById(id);
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }
        if (req.user && req.user.role === 'superadmin') {
            hotel.isArchived = false;
            await hotel.save();
            res.json({ message: 'Hotel restored successfully.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ hotelId: id, action: 'restore' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const approveUrl = `${process.env.API_URL || 'http://localhost:5000/api'}/hotels/action/approve/${token}`;
        const rejectUrl = `${process.env.API_URL || 'http://localhost:5000/api'}/hotels/action/reject/${token}`;
        const message = `
      <h2>Hotel Restore Request</h2>
      <p>A request has been made to restore the archived hotel: <strong>${hotel.name}</strong>.</p>
      <p>Please approve or reject this request by clicking one of the links below:</p>
      <br />
      <a href="${approveUrl}" style="padding:10px 20px; background-color:green; color:white; text-decoration:none; border-radius:5px;">Accept Restore</a>
      &nbsp;&nbsp;&nbsp;
      <a href="${rejectUrl}" style="padding:10px 20px; background-color:red; color:white; text-decoration:none; border-radius:5px;">Reject Restore</a>
    `;
        await (0, sendEmail_1.sendEmail)({
            email: 'm2n.hotel@gmail.com',
            subject: `Approval Required: Restore Hotel ${hotel.name}`,
            message
        });
        res.json({ message: 'Approval email sent for restoration.' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.restoreHotel = restoreHotel;
// @desc    Approve action
// @route   GET /api/hotels/action/approve/:token
// @access  Public
const approveAction = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const hotel = await Hotel_1.default.findById(decoded.hotelId);
        if (!hotel) {
            res.status(404).send('<h1>Hotel not found</h1>');
            return;
        }
        if (decoded.action === 'delete') {
            hotel.isArchived = true;
            await hotel.save();
            res.send(`<h1>Hotel "${hotel.name}" has been successfully deleted.</h1>`);
        }
        else if (decoded.action === 'restore') {
            hotel.isArchived = false;
            await hotel.save();
            res.send(`<h1>Hotel "${hotel.name}" has been successfully restored.</h1>`);
        }
        else {
            res.status(400).send('<h1>Invalid action</h1>');
        }
    }
    catch (error) {
        res.status(400).send('<h1>Invalid or expired token</h1>');
    }
};
exports.approveAction = approveAction;
// @desc    Reject action
// @route   GET /api/hotels/action/reject/:token
// @access  Public
const rejectAction = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const hotel = await Hotel_1.default.findById(decoded.hotelId);
        if (!hotel) {
            res.status(404).send('<h1>Hotel not found</h1>');
            return;
        }
        res.send(`<h1>The ${decoded.action} request for hotel "${hotel.name}" was successfully rejected.</h1>`);
    }
    catch (error) {
        res.status(400).send('<h1>Invalid or expired token</h1>');
    }
};
exports.rejectAction = rejectAction;
