import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  email: string;
  password?: string;
  role: 'admin' | 'superadmin';
  name: string;
  phone?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorVerified: boolean;
  twoFactorSetupCompletedAt?: Date;
  twoFactorBackupCodes: string[];
  permissions: string[];
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
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
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      default: null
    },
    twoFactorVerified: {
      type: Boolean,
      default: false
    },
    twoFactorSetupCompletedAt: {
      type: Date,
      default: null
    },
    twoFactorBackupCodes: {
      type: [String],
      default: []
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

adminSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
