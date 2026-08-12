"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreGlobalCategory = exports.archiveGlobalCategory = exports.updateGlobalCategory = exports.getGlobalCategories = exports.createGlobalCategory = void 0;
const GlobalRoomCategory_1 = __importDefault(require("../models/GlobalRoomCategory"));
// @desc    Create a new global category
// @route   POST /api/global-categories
// @access  Private (Admin)
const createGlobalCategory = async (req, res) => {
    try {
        const { name, amenities } = req.body;
        const categoryExists = await GlobalRoomCategory_1.default.findOne({ name, isArchived: false });
        if (categoryExists) {
            res.status(400).json({ message: 'Category already exists' });
            return;
        }
        const newCategory = await GlobalRoomCategory_1.default.create({
            name,
            amenities: amenities || [],
        });
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.createGlobalCategory = createGlobalCategory;
// @desc    Get global categories
// @route   GET /api/global-categories
// @access  Private (Admin)
const getGlobalCategories = async (req, res) => {
    try {
        const archived = req.query.archived === 'true';
        const categories = await GlobalRoomCategory_1.default.find({ isArchived: archived });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.getGlobalCategories = getGlobalCategories;
// @desc    Update a global category
// @route   PUT /api/global-categories/:id
// @access  Private (Admin)
const updateGlobalCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amenities } = req.body;
        const category = await GlobalRoomCategory_1.default.findById(id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        if (name) {
            // check if another category has this name
            const existing = await GlobalRoomCategory_1.default.findOne({ name, isArchived: false });
            if (existing && existing._id.toString() !== id) {
                res.status(400).json({ message: 'Another category with this name already exists' });
                return;
            }
            category.name = name;
        }
        if (amenities) {
            category.amenities = amenities;
        }
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.updateGlobalCategory = updateGlobalCategory;
// @desc    Archive a global category (soft delete)
// @route   DELETE /api/global-categories/:id
// @access  Private (Admin)
const archiveGlobalCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await GlobalRoomCategory_1.default.findById(id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        category.isArchived = true;
        await category.save();
        res.json({ message: 'Category archived' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.archiveGlobalCategory = archiveGlobalCategory;
// @desc    Restore an archived global category
// @route   PUT /api/global-categories/:id/restore
// @access  Private (Admin)
const restoreGlobalCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await GlobalRoomCategory_1.default.findById(id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        category.isArchived = false;
        await category.save();
        res.json({ message: 'Category restored' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.restoreGlobalCategory = restoreGlobalCategory;
