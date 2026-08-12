import mongoose, { Document, Schema } from 'mongoose';

export interface IRoomCategory extends Document {
  hotelId: mongoose.Types.ObjectId;
  name: string;
  numberOfRooms: number;
  roomSize: string;
  numberOfBeds: number;
  isAC: boolean;
  view: string;
  capacity: number;
  price: number;
  features: string[];
  images: string[];
  galleryImages: string[];
}

const roomCategorySchema = new Schema<IRoomCategory>({
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { type: String, required: true },
  numberOfRooms: { type: Number, required: true, default: 1 },
  roomSize: { type: String, required: true },
  numberOfBeds: { type: Number, required: true, default: 1 },
  isAC: { type: Boolean, required: true, default: false },
  view: { type: String, required: true },
  capacity: { type: Number, required: true },
  price: { type: Number, required: true },
  features: [{ type: String }],
  images: [{ type: String }],
  galleryImages: [{ type: String }],
}, {
  timestamps: true,
});

const RoomCategory = mongoose.model<IRoomCategory>('RoomCategory', roomCategorySchema);

export default RoomCategory;
