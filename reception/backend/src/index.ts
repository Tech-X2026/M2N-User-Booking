import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import hotelRoutes from './routes/hotelRoutes';
import publicRoutes from './routes/publicRoutes';
import globalCategoryRoutes from './routes/globalCategoryRoutes';
import bookingRoutes from './routes/bookingRoutes';
import receptionistRoutes from './routes/receptionistRoutes';

import './models/User';
import './models/Hotel';
import './models/RoomCategory';
import './models/Receptionist';

dotenv.config({ override: true });

connectDB();

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 800, // limit each IP to 800 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/global-categories', globalCategoryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/receptionists', receptionistRoutes);

// Serve static files from the 'dist' folder (which will contain frontend build)
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Reception Backend Server running on port ${PORT}`);
});

connectDB().then(() => {
  console.log('Connected to MongoDB');
});
