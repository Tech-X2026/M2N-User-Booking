"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptCancellation = exports.getCancellationRequests = exports.cancelBooking = exports.getHotelBookings = exports.getAllBookings = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const sendEmail_1 = require("../utils/sendEmail");
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking_1.default.find()
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
        const requests = await Booking_1.default.find({
            $or: [
                { cancellationRequested: true, status: 'confirmed' },
                { status: 'cancelled' }
            ]
        })
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
