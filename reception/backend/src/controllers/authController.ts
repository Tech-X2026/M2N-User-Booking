import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Receptionist from '../models/Receptionist';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check for Superadmin login (just in case they need to log into reception as superadmin)
    if (
      email === process.env.SUPERADMIN_EMAIL &&
      password === process.env.SUPERADMIN_PASSWORD
    ) {
      res.json({
        id: 'superadmin',
        name: 'Super Admin',
        email,
        role: 'superadmin',
        permissions: ['hotels', 'global_categories', 'bookings', 'admins', 'archives'], // Super admin has all permissions
        token: generateToken('superadmin', 'superadmin'),
      });
      return;
    }

    // Check for Receptionist login
    const receptionist = await Receptionist.findOne({ email });
    if (receptionist && (await receptionist.matchPassword(password))) {
      res.json({
        id: receptionist._id,
        name: receptionist.name,
        email: receptionist.email,
        role: receptionist.role,
        permissions: receptionist.permissions,
        hotelId: receptionist.hotelId,
        token: generateToken(receptionist._id.toString(), receptionist.role),
      });
      return;
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// The 2FA endpoints are kept as empty functions just so we don't break existing routes 
// that might still be mapped to them in authRoutes.ts, even though receptionists don't use 2FA yet.
export const setup2FA = async (req: Request, res: Response): Promise<void> => {
  res.status(400).json({ message: '2FA not supported for receptionists' });
};

export const verifySetup2FA = async (req: Request, res: Response): Promise<void> => {
  res.status(400).json({ message: '2FA not supported for receptionists' });
};

export const verifyLogin2FA = async (req: Request, res: Response): Promise<void> => {
  res.status(400).json({ message: '2FA not supported for receptionists' });
};

export const verifyBackupCode = async (req: Request, res: Response): Promise<void> => {
  res.status(400).json({ message: '2FA not supported for receptionists' });
};
