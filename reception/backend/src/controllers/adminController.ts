import { Request, Response } from 'express';
import Admin from '../models/Admin';
import bcrypt from 'bcryptjs';

// @desc    Get all admins
// @route   GET /api/admin
// @access  Private/Superadmin
export const getAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await Admin.find({}).select('-password');
    res.json(admins);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an admin
// @route   POST /api/admin
// @access  Private/Superadmin
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      phone,
    });

    if (admin) {
      res.status(201).json({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin (email, password, name)
// @route   PUT /api/admin/:id
// @access  Private/Superadmin
export const updateAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (admin) {
      admin.name = req.body.name || admin.name;
      admin.email = req.body.email || admin.email;
      admin.phone = req.body.phone || admin.phone;
      
      if (req.body.password) {
        admin.password = req.body.password;
      }

      const updatedAdmin = await admin.save();

      res.json({
        id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        phone: updatedAdmin.phone,
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/:id
// @access  Private/Superadmin
export const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (admin) {
      await admin.deleteOne();
      res.json({ message: 'Admin removed' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset 2FA for an admin
// @route   POST /api/admin/:id/reset-2fa
// @access  Private/Superadmin
export const resetAdmin2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (admin) {
      admin.twoFactorEnabled = false;
      admin.twoFactorVerified = false;
      admin.twoFactorSecret = undefined;
      admin.twoFactorBackupCodes = [];
      admin.twoFactorSetupCompletedAt = undefined;
      
      await admin.save();
      res.json({ message: '2FA has been reset for this admin' });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
