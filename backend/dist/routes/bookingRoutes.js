"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/check-availability', bookingController_1.checkAvailability);
router.post('/create', authMiddleware_1.protect, bookingController_1.createBooking);
router.post('/verify', authMiddleware_1.protect, bookingController_1.verifyPayment);
router.get('/my-bookings', authMiddleware_1.protect, bookingController_1.getMyBookings);
router.post('/:id/request-cancel', authMiddleware_1.protect, bookingController_1.requestCancellation);
exports.default = router;
