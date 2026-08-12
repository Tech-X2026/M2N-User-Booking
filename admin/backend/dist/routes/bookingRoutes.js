"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.protect, bookingController_1.getAllBookings);
router.get('/cancellation-requests', authMiddleware_1.protect, bookingController_1.getCancellationRequests);
router.get('/hotel/:hotelId', authMiddleware_1.protect, bookingController_1.getHotelBookings);
router.put('/:id/cancel', authMiddleware_1.protect, bookingController_1.cancelBooking);
router.post('/:id/accept-cancellation', authMiddleware_1.protect, bookingController_1.acceptCancellation);
exports.default = router;
