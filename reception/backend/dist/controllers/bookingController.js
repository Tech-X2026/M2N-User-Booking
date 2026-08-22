"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalkinBooking = exports.getAvailableRooms = exports.acceptCancellation = exports.getCancellationRequests = exports.cancelBooking = exports.getHotelBookings = exports.checkInBooking = exports.getBookingById = exports.getAllBookings = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const sendEmail_1 = require("../utils/sendEmail");
const googleDrive_1 = require("../utils/googleDrive");
const getAllBookings = async (req, res) => {
    try {
        const query = {};
        if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
            query.hotelId = req.user.hotelId;
        }
        const bookings = await prisma_1.default.booking.findMany({
            where: query,
            include: {
                user: { select: { name: true, email: true, phone: true } },
                hotel: { select: { name: true, city: true, state: true } },
                roomCategory: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        const formattedBookings = bookings.map(b => ({
            ...b,
            _id: b.id,
            userId: b.user ? { ...b.user, _id: b.userId } : null,
            hotelId: b.hotel ? { ...b.hotel, _id: b.hotelId } : null,
            roomCategoryId: b.roomCategory ? { ...b.roomCategory, _id: b.roomCategoryId } : null
        }));
        res.json(formattedBookings);
    }
    catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllBookings = getAllBookings;
const getBookingById = async (req, res) => {
    try {
        const booking = await prisma_1.default.booking.findUnique({
            where: { bookingId: req.params.id },
            include: {
                user: { select: { name: true, email: true, phone: true } },
                hotel: { select: { id: true, name: true, city: true, state: true } },
                roomCategory: { select: { name: true } }
            }
        });
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
            if (booking.hotelId !== req.user.hotelId) {
                res.status(403).json({ message: 'Not authorized to view this booking' });
                return;
            }
        }
        res.json({
            ...booking,
            _id: booking.id,
            userId: booking.user,
            hotelId: { ...booking.hotel, _id: booking.hotel.id },
            roomCategoryId: booking.roomCategory
        });
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
        const booking = await prisma_1.default.booking.findUnique({ where: { id } });
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }
        if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
            if (booking.hotelId !== req.user.hotelId) {
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
        const category = await prisma_1.default.roomCategory.findUnique({ where: { id: categoryId } });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        let roomsData = category.rooms;
        const roomIndex = roomsData.findIndex((r) => r._id === roomId || r.id === roomId);
        if (roomIndex === -1) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        // Get Hotel name for folder structure
        const hotel = await prisma_1.default.hotel.findUnique({ where: { id: booking.hotelId } });
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }
        // Upload to Google Drive
        const extension = file.originalname.split('.').pop() || 'png';
        const driveUrl = await (0, googleDrive_1.uploadToDrive)(file.buffer, file.mimetype, extension, booking.id, hotel.name);
        roomsData[roomIndex].status = 'CheckIn';
        await prisma_1.default.roomCategory.update({
            where: { id: categoryId },
            data: { rooms: roomsData }
        });
        // Update Booking
        const updatedBooking = await prisma_1.default.booking.update({
            where: { id },
            data: {
                validIdUrl: driveUrl,
                assignedRoomNumber: roomsData[roomIndex].roomNumber,
            }
        });
        res.json({ message: 'Checked in successfully', booking: { ...updatedBooking, _id: updatedBooking.id } });
    }
    catch (error) {
        console.error('Check in error:', error);
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.checkInBooking = checkInBooking;
const getHotelBookings = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const bookings = await prisma_1.default.booking.findMany({
            where: { hotelId },
            include: {
                user: { select: { name: true, email: true, phone: true } },
                roomCategory: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        const formattedBookings = bookings.map(b => ({
            ...b,
            _id: b.id,
            userId: b.user ? { ...b.user, _id: b.userId } : null,
            roomCategoryId: b.roomCategory ? { ...b.roomCategory, _id: b.roomCategoryId } : null
        }));
        res.json(formattedBookings);
    }
    catch (error) {
        console.error('Get hotel bookings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getHotelBookings = getHotelBookings;
const cancelBooking = async (req, res) => {
    try {
        const booking = await prisma_1.default.booking.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { name: true, email: true } },
                hotel: { select: { name: true } }
            }
        });
        if (booking) {
            const updatedBooking = await prisma_1.default.booking.update({
                where: { id: req.params.id },
                data: { status: 'cancelled' },
                include: {
                    user: { select: { name: true, email: true } },
                    hotel: { select: { name: true } }
                }
            });
            const user = updatedBooking.user;
            const hotel = updatedBooking.hotel;
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
            res.json({
                ...updatedBooking,
                _id: updatedBooking.id,
                userId: updatedBooking.user ? { ...updatedBooking.user, _id: updatedBooking.userId } : null,
                hotelId: updatedBooking.hotel ? { ...updatedBooking.hotel, _id: updatedBooking.hotelId } : null
            });
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
        const whereConditions = {
            OR: [
                { cancellationRequested: true, status: 'confirmed' },
                { status: 'cancelled' }
            ]
        };
        if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
            whereConditions.hotelId = req.user.hotelId;
        }
        const requests = await prisma_1.default.booking.findMany({
            where: whereConditions,
            include: {
                user: { select: { name: true, email: true, phone: true } },
                hotel: { select: { name: true, city: true, state: true } },
                roomCategory: { select: { name: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });
        const formattedRequests = requests.map(r => ({
            ...r,
            _id: r.id,
            userId: r.user ? { ...r.user, _id: r.userId } : null,
            hotelId: r.hotel ? { ...r.hotel, _id: r.hotelId } : null,
            roomCategoryId: r.roomCategory ? { ...r.roomCategory, _id: r.roomCategoryId } : null
        }));
        res.json(formattedRequests);
    }
    catch (error) {
        console.error('Get cancellation requests error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCancellationRequests = getCancellationRequests;
const acceptCancellation = async (req, res) => {
    try {
        const booking = await prisma_1.default.booking.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { name: true, email: true } },
                hotel: { select: { name: true } }
            }
        });
        if (booking) {
            const updatedBooking = await prisma_1.default.booking.update({
                where: { id: req.params.id },
                data: { status: 'cancelled' },
                include: {
                    user: { select: { name: true, email: true } },
                    hotel: { select: { name: true } }
                }
            });
            const user = updatedBooking.user;
            const hotel = updatedBooking.hotel;
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
            res.json({
                ...updatedBooking,
                _id: updatedBooking.id,
                userId: updatedBooking.user ? { ...updatedBooking.user, _id: updatedBooking.userId } : null,
                hotelId: updatedBooking.hotel ? { ...updatedBooking.hotel, _id: updatedBooking.hotelId } : null
            });
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
const getAvailableRooms = async (req, res) => {
    try {
        const { categoryId, checkIn, checkOut } = req.query;
        if (!categoryId || !checkIn || !checkOut) {
            res.status(400).json({ message: 'Missing parameters' });
            return;
        }
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        // Get the category and its rooms
        const category = await prisma_1.default.roomCategory.findUnique({ where: { id: categoryId } });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        const allRooms = Array.isArray(category.rooms) ? category.rooms : [];
        // Find overlapping bookings for this category
        const overlappingBookings = await prisma_1.default.booking.findMany({
            where: {
                roomCategoryId: categoryId,
                status: 'confirmed',
                checkIn: { lt: checkOutDate },
                checkOut: { gt: checkInDate }
            }
        });
        const bookedRoomNumbers = overlappingBookings.map(b => b.assignedRoomNumber).filter(Boolean);
        // Filter available rooms (only show rooms that are physically 'Ready' and not booked)
        const availableRooms = allRooms.filter((room) => room &&
            room.status === 'Ready' &&
            !bookedRoomNumbers.includes(room.roomNumber));
        res.json(availableRooms);
    }
    catch (error) {
        console.error('Get available rooms error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAvailableRooms = getAvailableRooms;
const createWalkinBooking = async (req, res) => {
    try {
        const { hotelId, roomCategoryId, checkIn, checkOut, quantity, adults, children, guestName, phone, email, address, nationality, assignedRoomNumber } = req.body;
        const file = req.file;
        if (!guestName || !phone || !assignedRoomNumber || !file) {
            res.status(400).json({ message: 'Missing required fields or ID document' });
            return;
        }
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        // Handle User creation or lookup
        let user;
        if (email && email !== 'null' && email !== '') {
            user = await prisma_1.default.user.findUnique({ where: { email } });
        }
        if (!user) {
            user = await prisma_1.default.user.create({
                data: {
                    name: guestName,
                    email: (email && email !== 'null' && email !== '') ? email : `walkin_${Date.now()}@m2n.com`, // dummy email if none provided
                    phone: phone,
                    nationality: (nationality && nationality !== 'null') ? nationality : null
                }
            });
        }
        const category = await prisma_1.default.roomCategory.findUnique({ where: { id: roomCategoryId } });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        // Get Hotel name for folder structure
        const hotel = await prisma_1.default.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
        const totalAmount = nights * category.price * Number(quantity || 1);
        // Generate 5-digit ID
        const lastBooking = await prisma_1.default.booking.findFirst({ orderBy: { createdAt: 'desc' } });
        let newBookingIdStr = '00000';
        if (lastBooking && lastBooking.bookingId) {
            const lastIdNum = parseInt(lastBooking.bookingId, 10);
            newBookingIdStr = (lastIdNum + 1).toString().padStart(5, '0');
        }
        // Upload to Google Drive
        const extension = file.originalname.split('.').pop() || 'png';
        const driveUrl = await (0, googleDrive_1.uploadToDrive)(file.buffer, file.mimetype, extension, newBookingIdStr, // Using bookingId as folder/reference
        hotel.name);
        // Create booking
        const booking = await prisma_1.default.booking.create({
            data: {
                bookingId: newBookingIdStr,
                userId: user.id,
                hotelId,
                roomCategoryId,
                checkIn: checkInDate,
                checkInTime: "12:00", // default
                checkOut: checkOutDate,
                checkOutTime: "11:00", // default
                quantity: Number(quantity || 1),
                adults: Number(adults || 1),
                children: Number(children || 0),
                totalAmount,
                status: 'confirmed', // walkins are confirmed immediately
                validIdUrl: driveUrl,
                assignedRoomNumber
            }
        });
        // Update Room Status in RoomCategory
        let roomsData = Array.isArray(category.rooms) ? category.rooms : [];
        const roomIndex = roomsData.findIndex((r) => r.roomNumber === assignedRoomNumber);
        if (roomIndex !== -1 && roomsData[roomIndex]) {
            roomsData[roomIndex].status = 'CheckIn'; // or 'Occupied'
            await prisma_1.default.roomCategory.update({
                where: { id: roomCategoryId },
                data: { rooms: roomsData }
            });
        }
        res.json({ message: 'Walk-in booking created successfully', booking: { ...booking, _id: booking.id } });
    }
    catch (error) {
        console.error('Create walkin booking error:', error);
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.createWalkinBooking = createWalkinBooking;
