import express from 'express';
import { checkAvailability, createBooking, verifyPayment, getMyBookings, requestCancellation } from '../controllers/bookingController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/check-availability', checkAvailability);
router.post('/create', protect, createBooking);
router.post('/verify', protect, verifyPayment);
router.get('/my-bookings', protect, getMyBookings);
router.post('/:id/request-cancel', protect, requestCancellation);

export default router;
