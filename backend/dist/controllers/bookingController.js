"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCancellation = exports.getMyBookings = exports.verifyPayment = exports.createBooking = exports.checkAvailability = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const razorpay_utils_1 = require("razorpay/dist/utils/razorpay-utils");
const prisma_1 = __importDefault(require("../utils/prisma"));
const checkAvailability = async (req, res) => {
    try {
        const { roomCategoryId, checkIn, checkOut, checkInTime, checkOutTime } = req.body;
        if (!roomCategoryId || !checkIn || !checkOut || !checkInTime || !checkOutTime) {
            return res.status(400).json({ message: 'Missing parameters' });
        }
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const checkInDateTime = new Date(`${checkIn}T${checkInTime}:00`);
        const now = new Date();
        if (checkInDateTime < now) {
            return res.status(400).json({ message: 'Check-in date and time cannot be in the past' });
        }
        if (checkInDate >= checkOutDate) {
            return res.status(400).json({ message: 'Check-out must be after check-in' });
        }
        const roomCategory = await prisma_1.default.roomCategory.findUnique({ where: { id: roomCategoryId } });
        if (!roomCategory) {
            return res.status(404).json({ message: 'Room category not found' });
        }
        // Find overlapping bookings that are confirmed
        const overlappingBookings = await prisma_1.default.booking.findMany({
            where: {
                roomCategoryId,
                status: 'confirmed',
                checkIn: { lt: checkOutDate },
                checkOut: { gt: checkInDate }
            }
        });
        const totalBookedRooms = overlappingBookings.reduce((sum, booking) => sum + booking.quantity, 0);
        const availableRooms = roomCategory.numberOfRooms - totalBookedRooms;
        res.json({
            availableRooms: availableRooms > 0 ? availableRooms : 0,
            totalRooms: roomCategory.numberOfRooms,
            pricePerNight: roomCategory.price
        });
    }
    catch (error) {
        console.error('Check availability error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.checkAvailability = checkAvailability;
const createBooking = async (req, res) => {
    try {
        const { hotelId, roomCategoryId, checkIn, checkOut, checkInTime, checkOutTime, quantity, adults, children } = req.body;
        if (!req.userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const checkInDateTime = new Date(`${checkIn}T${checkInTime}:00`);
        const now = new Date();
        if (checkInDateTime < now) {
            return res.status(400).json({ message: 'Check-in date and time cannot be in the past' });
        }
        if (checkInDate >= checkOutDate) {
            return res.status(400).json({ message: 'Check-out must be after check-in' });
        }
        const roomCategory = await prisma_1.default.roomCategory.findUnique({ where: { id: roomCategoryId } });
        if (!roomCategory)
            return res.status(404).json({ message: 'Room category not found' });
        const overlappingBookings = await prisma_1.default.booking.findMany({
            where: {
                roomCategoryId,
                status: 'confirmed',
                checkIn: { lt: checkOutDate },
                checkOut: { gt: checkInDate }
            }
        });
        const totalBookedRooms = overlappingBookings.reduce((sum, booking) => sum + booking.quantity, 0);
        const availableRooms = roomCategory.numberOfRooms - totalBookedRooms;
        if (availableRooms < quantity) {
            return res.status(400).json({ message: `Only ${availableRooms} rooms available for these dates` });
        }
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
        const totalAmount = nights * roomCategory.price * quantity;
        const razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        const lastBooking = await prisma_1.default.booking.findFirst({ orderBy: { createdAt: 'desc' } });
        let newBookingIdStr = '00000';
        if (lastBooking && lastBooking.bookingId) {
            const lastIdNum = parseInt(lastBooking.bookingId, 10);
            newBookingIdStr = (lastIdNum + 1).toString().padStart(5, '0');
        }
        const booking = await prisma_1.default.booking.create({
            data: {
                bookingId: newBookingIdStr,
                userId: req.userId,
                hotelId,
                roomCategoryId,
                checkIn: checkInDate,
                checkInTime,
                checkOut: checkOutDate,
                checkOutTime,
                quantity,
                adults: adults || 1,
                children: children || 0,
                totalAmount,
                status: 'pending',
                razorpayOrderId: order.id
            }
        });
        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            bookingId: booking.id, // Replaced _id with id
            keyId: process.env.RAZORPAY_KEY_ID
        });
    }
    catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createBooking = createBooking;
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        const isValid = (0, razorpay_utils_1.validatePaymentVerification)({ order_id: razorpay_order_id, payment_id: razorpay_payment_id }, razorpay_signature, process.env.RAZORPAY_KEY_SECRET?.trim());
        if (isValid) {
            const updatedBooking = await prisma_1.default.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'confirmed',
                    razorpayPaymentId: razorpay_payment_id
                },
                include: {
                    user: { select: { name: true, email: true } },
                    hotel: { select: { name: true, city: true, state: true } },
                    roomCategory: { select: { name: true } }
                }
            });
            if (updatedBooking) {
                const user = updatedBooking.user;
                const hotel = updatedBooking.hotel;
                const room = updatedBooking.roomCategory;
                if (user && user.email) {
                    try {
                        const { sendEmail } = await Promise.resolve().then(() => __importStar(require('../utils/email')));
                        await sendEmail({
                            to: user.email,
                            subject: 'Booking Confirmation - M2N Hotels',
                            text: `Your booking at ${hotel?.name || 'our hotel'} is confirmed.`,
                            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                  <h2 style="color: #B65C43;">Booking Confirmation</h2>
                  <p>Dear ${user.name},</p>
                  <p>Thank you for choosing M2N Group of Hotels. We are thrilled to inform you that your payment was successful and your booking is now <strong>confirmed</strong>!</p>
                  
                  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #B65C43;">Your Stay Details</h3>
                    <ul style="list-style-type: none; padding-left: 0;">
                      <li style="margin-bottom: 10px;"><strong>Hotel:</strong> ${hotel?.name}, ${hotel?.city}, ${hotel?.state}</li>
                      <li style="margin-bottom: 10px;"><strong>Room Category:</strong> ${room?.name}</li>
                      <li style="margin-bottom: 10px;"><strong>Rooms Booked:</strong> ${updatedBooking.quantity}</li>
                      <li style="margin-bottom: 10px;"><strong>Guests:</strong> ${updatedBooking.adults} Adults${updatedBooking.children ? `, ${updatedBooking.children} Children` : ''}</li>
                      <li style="margin-bottom: 10px;"><strong>Check-in:</strong> ${new Date(updatedBooking.checkIn).toLocaleDateString()} at ${updatedBooking.checkInTime}</li>
                      <li style="margin-bottom: 10px;"><strong>Check-out:</strong> ${new Date(updatedBooking.checkOut).toLocaleDateString()} at ${updatedBooking.checkOutTime}</li>
                      <li style="margin-bottom: 10px; border-top: 1px solid #ddd; padding-top: 10px;"><strong>Total Amount Paid:</strong> ₹${updatedBooking.totalAmount.toLocaleString()}</li>
                    </ul>
                  </div>
                  
                  <p>We eagerly await your arrival. If you have any special requests or need assistance prior to your stay, please do not hesitate to contact our support team.</p>
                  <p>We wish you a wonderful and comfortable stay!</p>
                  <br/>
                  <p>Warm regards,<br/><strong>M2N Group of Hotels</strong></p>
                </div>
              `
                        });
                    }
                    catch (emailError) {
                        console.error('Failed to send confirmation email:', emailError);
                    }
                }
            }
            res.json({ message: 'Payment verified successfully' });
        }
        else {
            await prisma_1.default.booking.update({ where: { id: bookingId }, data: { status: 'failed' } });
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    }
    catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.verifyPayment = verifyPayment;
const getMyBookings = async (req, res) => {
    try {
        if (!req.userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const bookings = await prisma_1.default.booking.findMany({
            where: { userId: req.userId },
            include: {
                hotel: { select: { name: true, city: true, state: true, images: true, lat: true, lng: true } },
                roomCategory: { select: { name: true, images: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        // Map Prisma relation names to Mongoose ref names to avoid frontend breakage
        const formattedBookings = bookings.map(b => ({
            ...b,
            _id: b.id,
            hotelId: b.hotel ? { ...b.hotel, _id: b.hotelId } : null,
            roomCategoryId: b.roomCategory ? { ...b.roomCategory, _id: b.roomCategoryId } : null
        }));
        res.json(formattedBookings);
    }
    catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMyBookings = getMyBookings;
const requestCancellation = async (req, res) => {
    try {
        if (!req.userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;
        const booking = await prisma_1.default.booking.findFirst({ where: { id, userId: req.userId } });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.status !== 'confirmed') {
            return res.status(400).json({ message: 'Only confirmed bookings can be cancelled' });
        }
        if (booking.cancellationRequested) {
            return res.status(400).json({ message: 'Cancellation already requested' });
        }
        const updatedBooking = await prisma_1.default.booking.update({
            where: { id },
            data: { cancellationRequested: true }
        });
        res.json(updatedBooking);
    }
    catch (error) {
        console.error('Request cancellation error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.requestCancellation = requestCancellation;
