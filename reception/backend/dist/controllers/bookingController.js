"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptCancellation = exports.getCancellationRequests = exports.cancelBooking = exports.getHotelBookings = exports.checkInBooking = exports.getBookingById = exports.getAllBookings = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const sendEmail_1 = require("../utils/sendEmail");
const RoomCategory_1 = __importDefault(require("../models/RoomCategory"));
const googleDrive_1 = require("../utils/googleDrive");
const Hotel_1 = __importDefault(require("../models/Hotel"));
const getAllBookings = async (req, res) => {
    try {
        const query = {};
        if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
            query.hotelId = req.user.hotelId;
        }
        const bookings = await Booking_1.default.find(query)
            .populate('userId', 'name email phone')
            .populate('hotelId', 'name city state')
            .populate('roomCategoryId', 'name')
            .sort({ createdAt: -1 });
        res.json(bookings);
    }
    catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllBookings = getAllBookings;
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking_1.default.findOne({ bookingId: req.params.id })
            .populate('userId', 'name email phone')
            .populate('hotelId', 'name city state')
            .populate('roomCategoryId', 'name');
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
            if (booking.hotelId._id.toString() !== req.user.hotelId.toString()) {
                res.status(403).json({ message: 'Not authorized to view this booking' });
                return;
            }
        }
        res.json(booking);
    }
    catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getBookingById = getBookingById;
const checkInBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomId, categoryId } = req.body;
        const booking = await Booking_1.default.findById(id);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
            if (booking.hotelId.toString() !== req.user.hotelId.toString()) {
                res.status(403).json({ message: 'Not authorized' });
                return;
            }
        }
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: 'Valid ID file is required' });
            return;
        }
        // Update Room Status
        const category = await RoomCategory_1.default.findById(categoryId);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        const room = category.rooms.find((r) => r._id.toString() === roomId);
        if (!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        // Get Hotel name for folder structure
        const hotel = await Hotel_1.default.findById(booking.hotelId);
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }
        // Upload to Google Drive
        const extension = file.originalname.split('.').pop() || 'png';
        const driveUrl = await (0, googleDrive_1.uploadToDrive)(file.buffer, file.mimetype, extension, booking._id.toString(), hotel.name);
        room.status = 'CheckIn';
        await category.save();
        // Update Booking
        booking.validIdUrl = driveUrl;
        booking.assignedRoomNumber = room.roomNumber;
        // Maybe you want to update status to 'checkedIn' ?
        // booking.status = 'checkedIn'; // Assuming status enum includes it, or leave as confirmed.
        await booking.save();
        res.json({ message: 'Checked in successfully', booking });
    }
    catch (error) {
        console.error('Check in error:', error);
        res.status(500).json({ message: 'Internal server error: ' + error.message });
    }
};
exports.checkInBooking = checkInBooking;
const getHotelBookings = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const bookings = await Booking_1.default.find({ hotelId })
            .populate('userId', 'name email phone')
            .populate('roomCategoryId', 'name')
            .sort({ createdAt: -1 });
        res.json(bookings);
    }
    catch (error) {
        console.error('Get hotel bookings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getHotelBookings = getHotelBookings;
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('hotelId', 'name');
        if (booking) {
            booking.status = 'cancelled';
            const updatedBooking = await booking.save();
            const user = booking.userId;
            const hotel = booking.hotelId;
            if (user && user.email) {
                try {
                    await (0, sendEmail_1.sendEmail)({
                        email: user.email,
                        subject: 'Booking Cancelled',
                        message: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Booking Cancellation</h2>
                <p>Dear ${user.name},</p>
                <p>We are writing to inform you that your booking at <strong>${hotel?.name || 'our hotel'}</strong> has been cancelled by the administration.</p>
                <p>If you have any questions or concerns, please contact our support.</p>
                <p>We hope to serve you again in the future.</p>
                <br/>
                <p>Best regards,<br/>M2N Group of Hotels</p>
              </div>
            `
                    });
                }
                catch (emailError) {
                    console.error('Failed to send cancellation email:', emailError);
                }
            }
            res.json(updatedBooking);
        }
        else {
            res.status(404).json({ message: 'Booking not found' });
        }
    }
    catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.cancelBooking = cancelBooking;
const getCancellationRequests = async (req, res) => {
    try {
        const query = {
            $or: [
                { cancellationRequested: true, status: 'confirmed' },
                { status: 'cancelled' }
            ]
        };
        if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
            query.hotelId = req.user.hotelId;
        }
        const requests = await Booking_1.default.find(query)
            .populate('userId', 'name email phone')
            .populate('hotelId', 'name city state')
            .populate('roomCategoryId', 'name')
            .sort({ updatedAt: -1 });
        res.json(requests);
    }
    catch (error) {
        console.error('Get cancellation requests error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCancellationRequests = getCancellationRequests;
const acceptCancellation = async (req, res) => {
    try {
        const booking = await Booking_1.default.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('hotelId', 'name');
        if (booking) {
            booking.status = 'cancelled';
            const updatedBooking = await booking.save();
            const user = booking.userId;
            const hotel = booking.hotelId;
            if (user && user.email) {
                try {
                    await (0, sendEmail_1.sendEmail)({
                        email: user.email,
                        subject: 'Cancellation Request Accepted - Refund Initiated',
                        message: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #B65C43;">Cancellation Request Accepted</h2>
                <p>Dear ${user.name},</p>
                <p>We are writing to inform you that your request to cancel your booking at <strong>${hotel?.name || 'our hotel'}</strong> has been accepted and processed.</p>
                <p><strong>Your refund has been initiated</strong> and you will receive it in your original payment method within <strong>5 to 7 business days</strong>.</p>
                <p>We hope to serve you again in the future.</p>
                <br/>
                <p>Best regards,<br/><strong>M2N Group of Hotels</strong></p>
              </div>
            `
                    });
                }
                catch (emailError) {
                    console.error('Failed to send cancellation email:', emailError);
                }
            }
            res.json(updatedBooking);
        }
        else {
            res.status(404).json({ message: 'Booking not found' });
        }
    }
    catch (error) {
        console.error('Accept cancellation error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.acceptCancellation = acceptCancellation;
