import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  userId: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  roomCategoryId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkInTime: string;
  checkOut: Date;
  checkOutTime: string;
  quantity: number;
  adults: number;
  children: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  cancellationRequested: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  bookingId: { type: String, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  roomCategoryId: { type: Schema.Types.ObjectId, ref: 'RoomCategory', required: true },
  checkIn: { type: Date, required: true },
  checkInTime: { type: String, required: true },
  checkOut: { type: Date, required: true },
  checkOutTime: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'failed', 'cancelled'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  cancellationRequested: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
