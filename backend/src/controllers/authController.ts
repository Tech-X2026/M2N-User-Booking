import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { sendEmail, generateOTPEmailHtml } from '../utils/email';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const emailLowerCase = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLowerCase });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: emailLowerCase,
      password: hashedPassword,
      phone,
      isVerified: false
    });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorOtp = await bcrypt.hash(otp, 10);
    user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Welcome! Your Registration OTP',
      text: `Your One-Time Password for registration is: ${otp}. It will expire in 10 minutes.`,
      html: generateOTPEmailHtml(
        'Your Registration OTP',
        'Your One-Time Password (OTP) for account registration is:',
        otp,
        10
      )
    });

    res.status(201).json({ requiresOTP: true, email: user.email, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailLowerCase = email.toLowerCase();
    const user = await User.findOne({ email: emailLowerCase });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'This account was created with Google. Please log in with Google, or reset your password to log in manually.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.isVerified === false) {
      return res.status(400).json({ message: 'Please verify your email first. Re-register to get a new OTP.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    res.json({ user: { _id: user._id, name: user.name, email: user.email, phone: user.phone }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyRegistrationOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const emailLowerCase = email.toLowerCase();
    const user = await User.findOne({ email: emailLowerCase });
    if (!user || !user.twoFactorOtp || !user.twoFactorExpires) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (user.twoFactorExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const isMatch = await bcrypt.compare(otp, user.twoFactorOtp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Clear OTP and set verified
    user.isVerified = true;
    user.twoFactorOtp = undefined;
    user.twoFactorExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    res.json({ user: { _id: user._id, name: user.name, email: user.email, phone: user.phone }, token });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailLowerCase = email.toLowerCase();
    const user = await User.findOne({ email: emailLowerCase });
    if (!user) {
      // Return 200 even if user not found for security (prevent email enumeration)
      return res.json({ message: 'If that email is registered, we have sent an OTP.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = await bcrypt.hash(otp, 10);
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP to reset your password is: ${otp}. It will expire in 15 minutes.`,
      html: generateOTPEmailHtml(
        'Password Reset OTP',
        'Your One-Time Password (OTP) to reset your password is:',
        otp,
        15
      )
    });

    res.json({ message: 'If that email is registered, we have sent an OTP.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailLowerCase = email.toLowerCase();
    const user = await User.findOne({ email: emailLowerCase });
    if (!user || !user.resetPasswordOtp || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'Invalid request or expired OTP' });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const isMatch = await bcrypt.compare(otp, user.resetPasswordOtp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        isVerified: true
        // password is not set because they use Google Login
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    res.json({ user: { _id: user._id, name: user.name, email: user.email, phone: user.phone }, token });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};
