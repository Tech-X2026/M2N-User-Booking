"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoomCategory = exports.updateRoomCategory = exports.getRoomCategoriesByHotel = exports.createRoomCategory = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// @desc    Create a new room category for a hotel
// @route   POST /api/hotels/:hotelId/categories
// @access  Private (Admin)
const createRoomCategory = async (req, res) => {
    try {
        const { hotelId } = req.params;
        // Check if hotel exists
        const hotel = await prisma_1.default.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }
        const { name, numberOfRooms, roomSize, numberOfBeds, isAC, view, capacity, price, features } = req.body;
        let parsedFeatures = [];
        if (typeof features === 'string') {
            parsedFeatures = features.split(',').map(f => f.trim()).filter(f => f !== '');
        }
        else if (Array.isArray(features)) {
            parsedFeatures = features;
        }
        const files = req.files;
        const images = files && files['images'] ? files['images'].map(file => file.path) : [];
        const galleryImages = files && files['galleryImages'] ? files['galleryImages'].map(file => file.path) : [];
        const newCategory = await prisma_1.default.roomCategory.create({
            data: {
                hotelId,
                name,
                numberOfRooms: Number(numberOfRooms),
                roomSize,
                numberOfBeds: Number(numberOfBeds),
                isAC: isAC === 'true' || isAC === true,
                view,
                capacity: Number(capacity),
                price: Number(price),
                features: parsedFeatures,
                images,
                galleryImages,
            }
        });
        res.status(201).json({ ...newCategory, _id: newCategory.id });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message || 'Server Error' });
    }
};
exports.createRoomCategory = createRoomCategory;
// @desc    Get all room categories for a hotel
// @route   GET /api/hotels/:hotelId/categories
// @access  Private (Admin)
const getRoomCategoriesByHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const categories = await prisma_1.default.roomCategory.findMany({ where: { hotelId } });
        const formattedCategories = categories.map(c => ({
            ...c,
            _id: c.id
        }));
        res.json(formattedCategories);
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message || 'Server Error' });
    }
};
exports.getRoomCategoriesByHotel = getRoomCategoriesByHotel;
// @desc    Update a room category
// @route   PUT /api/hotels/:hotelId/categories/:categoryId
// @access  Private (Admin)
const updateRoomCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await prisma_1.default.roomCategory.findUnique({ where: { id: categoryId } });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        const { name, numberOfRooms, roomSize, numberOfBeds, isAC, view, capacity, price, features } = req.body;
        let parsedFeatures = category.features;
        if (features !== undefined) {
            if (typeof features === 'string') {
                parsedFeatures = features.split(',').map(f => f.trim()).filter(f => f !== '');
            }
            else if (Array.isArray(features)) {
                parsedFeatures = features;
            }
        }
        const files = req.files;
        const newImages = files && files['images'] ? files['images'].map(file => file.path) : [];
        const newGalleryImages = files && files['galleryImages'] ? files['galleryImages'].map(file => file.path) : [];
        const updateData = {};
        if (name)
            updateData.name = name;
        if (numberOfRooms !== undefined)
            updateData.numberOfRooms = Number(numberOfRooms);
        if (roomSize)
            updateData.roomSize = roomSize;
        if (numberOfBeds !== undefined)
            updateData.numberOfBeds = Number(numberOfBeds);
        if (isAC !== undefined)
            updateData.isAC = (isAC === 'true' || isAC === true);
        if (view)
            updateData.view = view;
        if (capacity !== undefined)
            updateData.capacity = Number(capacity);
        if (price !== undefined)
            updateData.price = Number(price);
        updateData.features = parsedFeatures;
        if (newImages.length > 0) {
            updateData.images = [...category.images, ...newImages];
        }
        if (newGalleryImages.length > 0) {
            updateData.galleryImages = [...(category.galleryImages || []), ...newGalleryImages];
        }
        const updatedCategory = await prisma_1.default.roomCategory.update({
            where: { id: categoryId },
            data: updateData
        });
        res.json({ ...updatedCategory, _id: updatedCategory.id });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message || 'Server Error' });
    }
};
exports.updateRoomCategory = updateRoomCategory;
// @desc    Delete a room category
// @route   DELETE /api/hotels/:hotelId/categories/:categoryId
// @access  Private (Admin)
const deleteRoomCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await prisma_1.default.roomCategory.findUnique({ where: { id: categoryId } });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        await prisma_1.default.roomCategory.delete({ where: { id: categoryId } });
        res.json({ message: 'Category removed' });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message || 'Server Error' });
    }
};
exports.deleteRoomCategory = deleteRoomCategory;
