import { Request, Response } from 'express';
import Booking from '../models/Booking';
import { sendEmail } from '../utils/sendEmail';

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('hotelId', 'name city state')
      .populate('roomCategoryId', 'name')
      .sort({ createdAt: -1 });
      
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getHotelBookings = async (req: Request, res: Response) => {
  try {
    const { hotelId } = req.params;
    const bookings = await Booking.find({ hotelId })
      .populate('userId', 'name email phone')
      .populate('roomCategoryId', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get hotel bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('hotelId', 'name');

    if (booking) {
      booking.status = 'cancelled';
      const updatedBooking = await booking.save();
      
      const user = booking.userId as any;
      const hotel = booking.hotelId as any;
      
      if (user && user.email) {
        try {
          await sendEmail({
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
        } catch (emailError) {
          console.error('Failed to send cancellation email:', emailError);
        }
      }

      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCancellationRequests = async (req: Request, res: Response) => {
  try {
    const requests = await Booking.find({ 
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
  } catch (error) {
    console.error('Get cancellation requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const acceptCancellation = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('hotelId', 'name');

    if (booking) {
      booking.status = 'cancelled';
      const updatedBooking = await booking.save();
      
      const user = booking.userId as any;
      const hotel = booking.hotelId as any;
      
      if (user && user.email) {
        try {
          await sendEmail({
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
        } catch (emailError) {
          console.error('Failed to send cancellation email:', emailError);
        }
      }

      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error: any) {
    console.error('Accept cancellation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
