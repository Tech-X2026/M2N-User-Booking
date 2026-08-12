import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './src/models/Admin';
import connectDB from './src/config/db';

dotenv.config();

const migratePermissions = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    const result = await Admin.updateMany(
      {}, // Target all admins
      {
        $set: {
          permissions: ['hotels', 'global_categories', 'bookings']
        }
      }
    );

    console.log(`Successfully updated ${result.modifiedCount} admins with all permissions.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migratePermissions();
