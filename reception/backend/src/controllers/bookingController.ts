import { Request, Response } from 'express';
import Booking from '../models/Booking';
import { sendEmail } from '../utils/sendEmail';
import { AuthRequest } from '../middlewares/authMiddleware';
import RoomCategory from '../models/RoomCategory';
import { uploadToDrive } from '../utils/googleDrive';
import Hotel from '../models/Hotel';

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const query: any = {};
    if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
      query.hotelId = req.user.hotelId;
    }

    const bookings = await Booking.find(query)
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

export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id })
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
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkInBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { roomId, categoryId } = req.body;

    const booking = await Booking.findById(id);
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

    const file = req.file as Express.Multer.File;
    if (!file) {
      res.status(400).json({ message: 'Valid ID file is required' });
      return;
    }

    // Update Room Status
    const category = await RoomCategory.findById(categoryId);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const room = category.rooms.find((r: any) => r._id.toString() === roomId);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    // Get Hotel name for folder structure
    const hotel = await Hotel.findById(booking.hotelId);
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    // Upload to Google Drive
    const extension = file.originalname.split('.').pop() || 'png';
    const driveUrl = await uploadToDrive(
      file.buffer,
      file.mimetype,
      extension,
      booking._id.toString(),
      hotel.name
    );

    room.status = 'CheckIn';
    await category.save();

    // Update Booking
    booking.validIdUrl = driveUrl;
    booking.assignedRoomNumber = room.roomNumber;
    // Maybe you want to update status to 'checkedIn' ?
    // booking.status = 'checkedIn'; // Assuming status enum includes it, or leave as confirmed.
    await booking.save();

    res.json({ message: 'Checked in successfully', booking });
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({ message: 'Internal server error: ' + (error as any).message });
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

export const getCancellationRequests = async (req: AuthRequest, res: Response) => {
  try {
    const query: any = { 
      $or: [
        { cancellationRequested: true, status: 'confirmed' },
        { status: 'cancelled' }
      ]
    };
    if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
      query.hotelId = req.user.hotelId;
    }

    const requests = await Booking.find(query)
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
