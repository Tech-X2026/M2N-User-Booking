"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Hotel_1 = __importDefault(require("../models/Hotel"));
const RoomCategory_1 = __importDefault(require("../models/RoomCategory"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// @desc    Get all hotels (public) with aggregation for rooms and price
// @route   GET /api/public/hotels
router.get('/hotels', async (req, res) => {
    try {
        const hotels = await Hotel_1.default.aggregate([
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// @desc    Get single hotel
// @route   GET /api/public/hotels/:id
router.get('/hotels/:id', async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            res.status(404).json({ message: 'Invalid ID' });
            return;
        }
        const hotel = await Hotel_1.default.findOne({ _id: req.params.id, isArchived: { $ne: true } });
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }
        res.json(hotel);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// @desc    Get room categories for a hotel
// @route   GET /api/public/hotels/:id/categories
router.get('/hotels/:id/categories', async (req, res) => {
    try {
        const categories = await RoomCategory_1.default.find({ hotelId: req.params.id });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// @desc    Get all room categories (for general rooms page)
// @route   GET /api/public/categories
router.get('/categories', async (req, res) => {
    try {
        // Populate hotel to get the city/name if needed in the UI
        const categories = await RoomCategory_1.default.find().populate({
            path: 'hotelId',
            match: { isArchived: { $ne: true } },
            select: 'name city'
        });
        // Filter out categories where the hotel is archived (hotelId is null)
        const activeCategories = categories.filter(c => c.hotelId != null);
        res.json(activeCategories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
