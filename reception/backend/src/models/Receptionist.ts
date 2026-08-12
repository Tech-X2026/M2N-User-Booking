import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IReceptionist extends Document {
  hotelId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: 'receptionist';
  phone?: string;
  permissions: string[];
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const receptionistSchema = new Schema<IReceptionist>(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      unique: true, // Only one receptionist per hotel
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'receptionist',
    },
    phone: {
      type: String,
    },
    permissions: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
  }
);

receptionistSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

receptionistSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

const Receptionist: Model<IReceptionist> = mongoose.model<IReceptionist>('Receptionist', receptionistSchema);

export default Receptionist;
