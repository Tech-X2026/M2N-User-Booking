import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { generateSecret, generateURI, verify } from 'otplib';
import QRCode from 'qrcode';
import crypto from 'crypto';

const generateChallengeToken = (id: string, role: string) => {
  return jwt.sign({ id, role, challenge: true }, process.env.JWT_SECRET as string, {
    expiresIn: '10m', // 10 minutes to finish 2FA
  });
};

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check for Superadmin login
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

    // Check for regular Admin login
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      const challengeToken = generateChallengeToken(admin._id.toString(), admin.role);

      if (!admin.twoFactorEnabled) {
        res.json({
          requiresSetup: true,
          challengeToken
        });
        return;
      }

      res.json({
        requires2FA: true,
        challengeToken
      });
      return;
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const setup2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const { challengeToken } = req.body;
    if (!challengeToken) {
       res.status(401).json({ message: 'No challenge token' }); return;
    }

    const decoded = jwt.verify(challengeToken, process.env.JWT_SECRET as string) as any;
    if (!decoded.challenge) {
       res.status(401).json({ message: 'Invalid token' }); return;
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
       res.status(404).json({ message: 'Admin not found' }); return;
    }
    if (admin.twoFactorEnabled) {
       res.status(400).json({ message: '2FA is already enabled' }); return;
    }

    const secret = generateSecret();
    admin.twoFactorSecret = secret;
    await admin.save();

    const otpauthUrl = generateURI({ issuer: 'M2N Hotels', label: admin.email, secret });
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    res.json({ qrCode: qrCodeUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase()); // e.g. 8 chars
  }
  return codes;
};

export const verifySetup2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const { challengeToken, code } = req.body;
    const decoded = jwt.verify(challengeToken, process.env.JWT_SECRET as string) as any;
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.twoFactorSecret) {
       res.status(400).json({ message: 'Invalid setup request' }); return;
    }

    const result = await verify({ token: code, secret: admin.twoFactorSecret });
    if (!result.valid) {
       res.status(400).json({ message: 'Invalid verification code' }); return;
    }

    const backupCodes = generateBackupCodes();
    admin.twoFactorBackupCodes = backupCodes.map(c => hashToken(c));
    admin.twoFactorEnabled = true;
    admin.twoFactorVerified = true;
    admin.twoFactorSetupCompletedAt = new Date();
    await admin.save();

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      token: generateToken(admin._id.toString(), admin.role),
      backupCodes // Return only once in plain text
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyLogin2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const { challengeToken, code } = req.body;
    const decoded = jwt.verify(challengeToken, process.env.JWT_SECRET as string) as any;
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.twoFactorSecret) {
       res.status(400).json({ message: 'Invalid login request' }); return;
    }

    const result = await verify({ token: code, secret: admin.twoFactorSecret });
    if (!result.valid) {
       res.status(400).json({ message: 'Invalid verification code' }); return;
    }

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      token: generateToken(admin._id.toString(), admin.role),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyBackupCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { challengeToken, code } = req.body;
    const decoded = jwt.verify(challengeToken, process.env.JWT_SECRET as string) as any;
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.twoFactorBackupCodes) {
       res.status(400).json({ message: 'Invalid login request' }); return;
    }

    const hashedCode = hashToken(code);
    const codeIndex = admin.twoFactorBackupCodes.indexOf(hashedCode);

    if (codeIndex === -1) {
       res.status(400).json({ message: 'Invalid backup code' }); return;
    }

    // Remove the used backup code
    admin.twoFactorBackupCodes.splice(codeIndex, 1);
    await admin.save();

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      token: generateToken(admin._id.toString(), admin.role),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
