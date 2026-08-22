"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const router = express_1.default.Router();
// @desc    Get all hotels (public) with aggregation for rooms and price
// @route   GET /api/public/hotels
router.get('/hotels', async (req, res) => {
    try {
        const hotels = await prisma_1.default.hotel.findMany({
            where: { isArchived: false },
            include: {
                categories: {
                    select: { numberOfRooms: true, price: true }
                }
            }
        });
        const formattedHotels = hotels.map(hotel => {
            const totalRooms = hotel.categories.reduce((acc, cat) => acc + cat.numberOfRooms, 0);
            const priceFrom = hotel.categories.length > 0 ? Math.min(...hotel.categories.map(cat => cat.price)) : null;
            // Exclude categories to match the original $project
            const { categories, ...rest } = hotel;
            return {
                ...rest,
                _id: hotel.id,
                coords: { lat: hotel.lat, lng: hotel.lng },
                totalRooms,
                priceFrom
            };
        });
        res.json(formattedHotels);
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
});
// @desc    Get single hotel
// @route   GET /api/public/hotels/:id
router.get('/hotels/:id', async (req, res) => {
    try {
        const hotel = await prisma_1.default.hotel.findFirst({
            where: { id: req.params.id, isArchived: false }
        });
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }
        res.json({ ...hotel, _id: hotel.id, coords: { lat: hotel.lat, lng: hotel.lng } });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
});
// @desc    Get room categories for a hotel
// @route   GET /api/public/hotels/:id/categories
router.get('/hotels/:id/categories', async (req, res) => {
    try {
        const categories = await prisma_1.default.roomCategory.findMany({
            where: { hotelId: req.params.id }
        });
        const formattedCategories = categories.map(c => ({
            ...c,
            _id: c.id
        }));
        res.json(formattedCategories);
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
});
// @desc    Get all room categories (for general rooms page)
// @route   GET /api/public/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma_1.default.roomCategory.findMany({
            where: {
                hotel: { isArchived: false }
            },
            include: {
                hotel: { select: { name: true, city: true } }
            }
        });
        const activeCategories = categories.map(c => ({
            ...c,
            _id: c.id,
            hotelId: c.hotel
        }));
        res.json(activeCategories);
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
});
exports.default = router;
