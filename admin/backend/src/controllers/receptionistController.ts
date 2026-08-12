import { Request, Response } from 'express';
import Receptionist from '../models/Receptionist';

// @desc    Get all receptionists
// @route   GET /api/receptionists
// @access  Private/SuperAdmin
export const getReceptionists = async (req: Request, res: Response) => {
  try {
    const receptionists = await Receptionist.find({}).populate('hotelId', 'name');
    res.json(receptionists);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a receptionist
// @route   POST /api/receptionists
// @access  Private/SuperAdmin
export const createReceptionist = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone, hotelId, permissions } = req.body;

  try {
    const receptionistExists = await Receptionist.findOne({ email });

    if (receptionistExists) {
      res.status(400).json({ message: 'Receptionist already exists' });
      return;
    }

    const hotelExists = await Receptionist.findOne({ hotelId });
    if (hotelExists) {
      res.status(400).json({ message: 'A receptionist is already assigned to this hotel' });
      return;
    }

    const receptionist = await Receptionist.create({
      name,
      email,
      password,
      phone,
      hotelId,
      permissions: permissions || [],
    });

    if (receptionist) {
      res.status(201).json({
        _id: receptionist._id,
        name: receptionist.name,
        email: receptionist.email,
        hotelId: receptionist.hotelId,
        role: receptionist.role,
        permissions: receptionist.permissions,
      });
    } else {
      res.status(400).json({ message: 'Invalid receptionist data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a receptionist
// @route   PUT /api/receptionists/:id
// @access  Private/SuperAdmin
export const updateReceptionist = async (req: Request, res: Response): Promise<void> => {
  try {
    const receptionist = await Receptionist.findById(req.params.id);

    if (receptionist) {
      receptionist.name = req.body.name || receptionist.name;
      receptionist.email = req.body.email || receptionist.email;
      receptionist.phone = req.body.phone || receptionist.phone;
      if (req.body.permissions !== undefined) {
        receptionist.permissions = req.body.permissions;
      }
      
      if (req.body.hotelId) {
        // check if another receptionist is already assigned to this new hotel
        if (req.body.hotelId !== receptionist.hotelId.toString()) {
           const hotelExists = await Receptionist.findOne({ hotelId: req.body.hotelId });
           if (hotelExists) {
             res.status(400).json({ message: 'A receptionist is already assigned to this hotel' });
             return;
           }
        }
        receptionist.hotelId = req.body.hotelId;
      }

      if (req.body.password) {
        receptionist.password = req.body.password;
      }

      const updatedReceptionist = await receptionist.save();
      res.json({
        _id: updatedReceptionist._id,
        name: updatedReceptionist.name,
        email: updatedReceptionist.email,
        hotelId: updatedReceptionist.hotelId,
        role: updatedReceptionist.role,
        permissions: updatedReceptionist.permissions,
      });
    } else {
      res.status(404).json({ message: 'Receptionist not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a receptionist
// @route   DELETE /api/receptionists/:id
// @access  Private/SuperAdmin
export const deleteReceptionist = async (req: Request, res: Response): Promise<void> => {
  try {
    const receptionist = await Receptionist.findById(req.params.id);

    if (receptionist) {
      await receptionist.deleteOne();
      res.json({ message: 'Receptionist removed' });
    } else {
      res.status(404).json({ message: 'Receptionist not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
