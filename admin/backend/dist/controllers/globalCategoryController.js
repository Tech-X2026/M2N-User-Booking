"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreGlobalCategory = exports.archiveGlobalCategory = exports.updateGlobalCategory = exports.getGlobalCategories = exports.createGlobalCategory = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// @desc    Create a new global category
// @route   POST /api/global-categories
// @access  Private (Admin)
const createGlobalCategory = async (req, res) => {
    try {
        const { name, amenities } = req.body;
        const categoryExists = await prisma_1.default.globalRoomCategory.findFirst({
            where: { name, isArchived: false }
        });
        if (categoryExists) {
            res.status(400).json({ message: 'Category already exists' });
            return;
        }
        const newCategory = await prisma_1.default.globalRoomCategory.create({
            data: {
                name,
                amenities: amenities || [],
            }
        });
        res.status(201).json({ ...newCategory, _id: newCategory.id });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message || 'Server Error' });
    }
};
exports.createGlobalCategory = createGlobalCategory;
// @desc    Get global categories
// @route   GET /api/global-categories
// @access  Private (Admin)
const getGlobalCategories = async (req, res) => {
    try {
        const archived = req.query.archived === 'true';
        const categories = await prisma_1.default.globalRoomCategory.findMany({
            where: { isArchived: archived }
        });
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
exports.getGlobalCategories = getGlobalCategories;
// @desc    Update a global category
// @route   PUT /api/global-categories/:id
// @access  Private (Admin)
const updateGlobalCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amenities } = req.body;
        const category = await prisma_1.default.globalRoomCategory.findUnique({ where: { id } });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        const updateData = {};
        if (name) {
            const existing = await prisma_1.default.globalRoomCategory.findFirst({
                where: { name, isArchived: false }
            });
            if (existing && existing.id !== id) {
                res.status(400).json({ message: 'Another category with this name already exists' });
                return;
            }
            updateData.name = name;
        }
        if (amenities) {
            updateData.amenities = amenities;
        }
        const updatedCategory = await prisma_1.default.globalRoomCategory.update({
            where: { id },
            data: updateData
        });
        res.json({ ...updatedCategory, _id: updatedCategory.id });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message || 'Server Error' });
    }
};
exports.updateGlobalCategory = updateGlobalCategory;
// @desc    Archive a global category (soft delete)
// @route   DELETE /api/global-categories/:id
// @access  Private (Admin)
const archiveGlobalCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma_1.default.globalRoomCategory.findUnique({ where: { id } });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        await prisma_1.default.globalRoomCategory.update({
            where: { id },
            data: { isArchived: true }
        });
        res.json({ message: 'Category archived' });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message || 'Server Error' });
    }
};
exports.archiveGlobalCategory = archiveGlobalCategory;
// @desc    Restore an archived global category
// @route   PUT /api/global-categories/:id/restore
// @access  Private (Admin)
const restoreGlobalCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma_1.default.globalRoomCategory.findUnique({ where: { id } });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        await prisma_1.default.globalRoomCategory.update({
            where: { id },
            data: { isArchived: false }
        });
        res.json({ message: 'Category restored' });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message || 'Server Error' });
    }
};
exports.restoreGlobalCategory = restoreGlobalCategory;
