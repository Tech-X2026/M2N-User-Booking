import express, { Request, Response } from 'express';
import Hotel from '../models/Hotel';
import RoomCategory from '../models/RoomCategory';
import mongoose from 'mongoose';

const router = express.Router();

// @desc    Get all hotels (public) with aggregation for rooms and price
// @route   GET /api/public/hotels
router.get('/hotels', async (req: Request, res: Response): Promise<void> => {
  try {
    const hotels = await Hotel.aggregate([
      { $match: { isArchived: { $ne: true } } },
      {
        $lookup: {
          from: 'roomcategories',
          localField: '_id',
          foreignField: 'hotelId',
          as: 'categories'
        }
      },
      {
        $addFields: {
          totalRooms: { $sum: "$categories.numberOfRooms" },
          priceFrom: { $min: "$categories.price" }
        }
      },
      {
        $project: {
          categories: 0 // We don't need the full categories array here
        }
      }
    ]);
    res.json(hotels);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single hotel
// @route   GET /api/public/hotels/:id
router.get('/hotels/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({ message: 'Invalid ID' });
      return;
    }
    const hotel = await Hotel.findOne({ _id: req.params.id, isArchived: { $ne: true } });
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }
    res.json(hotel);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get room categories for a hotel
// @route   GET /api/public/hotels/:id/categories
router.get('/hotels/:id/categories', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await RoomCategory.find({ hotelId: req.params.id });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all room categories (for general rooms page)
// @route   GET /api/public/categories
router.get('/categories', async (req: Request, res: Response): Promise<void> => {
  try {
    // Populate hotel to get the city/name if needed in the UI
    const categories = await RoomCategory.find().populate({
      path: 'hotelId',
      match: { isArchived: { $ne: true } },
      select: 'name city'
    });
    // Filter out categories where the hotel is archived (hotelId is null)
    const activeCategories = categories.filter(c => c.hotelId != null);
    res.json(activeCategories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
