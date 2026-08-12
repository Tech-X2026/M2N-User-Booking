import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  city: string;
  state: string;
  type: string;
  tagline: string;
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
  description: string;
  images: string[];
  addedBy: mongoose.Types.ObjectId;
  isArchived: boolean;
}

const hotelSchema = new Schema<IHotel>({
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  type: { type: String, required: true },
  tagline: { type: String, required: true },
  address: { type: String, required: true },
  coords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  description: { type: String, required: true },
  images: [{ type: String }],
  addedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  isArchived: { type: Boolean, default: false }
}, {
  timestamps: true,
});

const Hotel = mongoose.model<IHotel>('Hotel', hotelSchema);

export default Hotel;
