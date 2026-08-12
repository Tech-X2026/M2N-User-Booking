import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional if using OAuth
  phone?: string;
  resetPasswordOtp?: string;
  resetPasswordExpires?: Date;
  twoFactorOtp?: string;
  twoFactorExpires?: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String },
  resetPasswordOtp: { type: String },
  resetPasswordExpires: { type: Date },
  twoFactorOtp: { type: String },
  twoFactorExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
