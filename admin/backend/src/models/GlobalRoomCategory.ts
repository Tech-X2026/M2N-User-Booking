import mongoose, { Document, Schema } from 'mongoose';

export interface IGlobalRoomCategory extends Document {
  name: string;
  amenities: string[];
  isArchived: boolean;
}

const GlobalRoomCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      trim: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const GlobalRoomCategory = mongoose.model<IGlobalRoomCategory>('GlobalRoomCategory', GlobalRoomCategorySchema);

export default GlobalRoomCategory;
