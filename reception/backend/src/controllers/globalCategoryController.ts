import { Request, Response } from 'express';
import GlobalRoomCategory from '../models/GlobalRoomCategory';

// @desc    Create a new global category
// @route   POST /api/global-categories
// @access  Private (Admin)
export const createGlobalCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, amenities } = req.body;

    const categoryExists = await GlobalRoomCategory.findOne({ name });
    if (categoryExists) {
      res.status(400).json({ message: 'Category already exists' });
      return;
    }

    const newCategory = await GlobalRoomCategory.create({
      name,
      amenities: amenities || [],
    });

    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get global categories
// @route   GET /api/global-categories
// @access  Private (Admin)
export const getGlobalCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const archived = req.query.archived === 'true';
    const categories = await GlobalRoomCategory.find({ isArchived: archived });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a global category
// @route   PUT /api/global-categories/:id
// @access  Private (Admin)
export const updateGlobalCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, amenities } = req.body;

    const category = await GlobalRoomCategory.findById(id);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    if (name) {
        // check if another category has this name
        const existing = await GlobalRoomCategory.findOne({ name });
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
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Archive a global category (soft delete)
// @route   DELETE /api/global-categories/:id
// @access  Private (Admin)
export const archiveGlobalCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await GlobalRoomCategory.findById(id);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    category.isArchived = true;
    await category.save();
    res.json({ message: 'Category archived' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Restore an archived global category
// @route   PUT /api/global-categories/:id/restore
// @access  Private (Admin)
export const restoreGlobalCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await GlobalRoomCategory.findById(id);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    category.isArchived = false;
    await category.save();
    res.json({ message: 'Category restored' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
