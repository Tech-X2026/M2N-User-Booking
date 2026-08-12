"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoomCategory = exports.updateRoomCategory = exports.getRoomCategoriesByHotel = exports.createRoomCategory = void 0;
const RoomCategory_1 = __importDefault(require("../models/RoomCategory"));
const Hotel_1 = __importDefault(require("../models/Hotel"));
// @desc    Create a new room category for a hotel
// @route   POST /api/hotels/:hotelId/categories
// @access  Private (Admin)
const createRoomCategory = async (req, res) => {
    try {
        const { hotelId } = req.params;
        // Check if hotel exists
        const hotel = await Hotel_1.default.findById(hotelId);
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }
        const { name, numberOfRooms, roomSize, numberOfBeds, isAC, view, capacity, price, features } = req.body;
        // features will come as string from FormData if it's an array we need to parse or handle appropriately
        // e.g. "TV,Wifi,Mini Bar" or repeated fields. Assuming frontend sends JSON stringified or comma separated.
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
        const newCategory = await RoomCategory_1.default.create({
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
        });
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.createRoomCategory = createRoomCategory;
// @desc    Get all room categories for a hotel
// @route   GET /api/hotels/:hotelId/categories
// @access  Private (Admin)
const getRoomCategoriesByHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const categories = await RoomCategory_1.default.find({ hotelId });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.getRoomCategoriesByHotel = getRoomCategoriesByHotel;
// @desc    Update a room category
// @route   PUT /api/hotels/:hotelId/categories/:categoryId
// @access  Private (Admin)
const updateRoomCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await RoomCategory_1.default.findById(categoryId);
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
        category.name = name || category.name;
        category.numberOfRooms = numberOfRooms !== undefined ? Number(numberOfRooms) : category.numberOfRooms;
        category.roomSize = roomSize || category.roomSize;
        category.numberOfBeds = numberOfBeds !== undefined ? Number(numberOfBeds) : category.numberOfBeds;
        category.isAC = isAC !== undefined ? (isAC === 'true' || isAC === true) : category.isAC;
        category.view = view || category.view;
        category.capacity = capacity !== undefined ? Number(capacity) : category.capacity;
        category.price = price !== undefined ? Number(price) : category.price;
        category.features = parsedFeatures;
        if (newImages.length > 0) {
            category.images = [...category.images, ...newImages];
        }
        if (newGalleryImages.length > 0) {
            category.galleryImages = [...(category.galleryImages || []), ...newGalleryImages];
        }
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.updateRoomCategory = updateRoomCategory;
// @desc    Delete a room category
// @route   DELETE /api/hotels/:hotelId/categories/:categoryId
// @access  Private (Admin)
const deleteRoomCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await RoomCategory_1.default.findById(categoryId);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        await category.deleteOne();
        res.json({ message: 'Category removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.deleteRoomCategory = deleteRoomCategory;
