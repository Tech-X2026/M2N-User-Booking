import { Request, Response } from 'express';
import RoomCategory from '../models/RoomCategory';
import Hotel from '../models/Hotel';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc    Create a new room category for a hotel
// @route   POST /api/hotels/:hotelId/categories
// @access  Private (Admin)
export const createRoomCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { hotelId } = req.params;
    
    if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
      if (hotelId !== req.user.hotelId.toString()) {
        res.status(403).json({ message: 'You can only add categories to your assigned hotel' });
        return;
      }
    }

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }

    const { 
      name, 
      numberOfRooms, 
      roomSize, 
      numberOfBeds, 
      isAC, 
      view, 
      capacity, 
      price, 
      features 
    } = req.body;

    // features will come as string from FormData if it's an array we need to parse or handle appropriately
    // e.g. "TV,Wifi,Mini Bar" or repeated fields. Assuming frontend sends JSON stringified or comma separated.
    let parsedFeatures: string[] = [];
    if (typeof features === 'string') {
        parsedFeatures = features.split(',').map(f => f.trim()).filter(f => f !== '');
    } else if (Array.isArray(features)) {
        parsedFeatures = features;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const images = files && files['images'] ? files['images'].map(file => file.path) : [];
    const galleryImages = files && files['galleryImages'] ? files['galleryImages'].map(file => file.path) : [];

    const generatedRooms = [];
    for (let i = 1; i <= Number(numberOfRooms); i++) {
      generatedRooms.push({ roomNumber: `${i}`, status: 'Ready' as const });
    }

    const newCategory = await RoomCategory.create({
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
      rooms: generatedRooms,
    });

    res.status(201).json(newCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all room categories for a hotel
// @route   GET /api/hotels/:hotelId/categories
// @access  Private (Admin)
export const getRoomCategoriesByHotel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { hotelId } = req.params;
    
    if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
      if (hotelId !== req.user.hotelId.toString()) {
        res.status(403).json({ message: 'You can only view categories for your assigned hotel' });
        return;
      }
    }

    const categories = await RoomCategory.find({ hotelId });
    
    // Backfill rooms for existing legacy data if needed
    for (const cat of categories) {
      if (!cat.rooms || cat.rooms.length === 0) {
        const generatedRooms = [];
        for (let i = 1; i <= cat.numberOfRooms; i++) {
          generatedRooms.push({ roomNumber: `${i}`, status: 'Ready' as const });
        }
        cat.rooms = generatedRooms;
        await cat.save();
      }
    }

    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a room category
// @route   PUT /api/hotels/:hotelId/categories/:categoryId
// @access  Private (Admin)
export const updateRoomCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { categoryId, hotelId } = req.params; // Make sure we have hotelId from params

    if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
      if (hotelId && hotelId !== req.user.hotelId.toString()) {
        res.status(403).json({ message: 'You can only update categories for your assigned hotel' });
        return;
      }
    }

    const category = await RoomCategory.findById(categoryId);
    
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const { 
      name, numberOfRooms, roomSize, numberOfBeds, isAC, view, capacity, price, features 
    } = req.body;

    let parsedFeatures = category.features;
    if (features !== undefined) {
      if (typeof features === 'string') {
          parsedFeatures = features.split(',').map(f => f.trim()).filter(f => f !== '');
      } else if (Array.isArray(features)) {
          parsedFeatures = features;
      }
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
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
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a room category
// @route   DELETE /api/hotels/:hotelId/categories/:categoryId
// @access  Private (Admin)
export const deleteRoomCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { categoryId, hotelId } = req.params;
    
    if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
      if (hotelId && hotelId !== req.user.hotelId.toString()) {
        res.status(403).json({ message: 'You can only delete categories for your assigned hotel' });
        return;
      }
    }

    const category = await RoomCategory.findById(categoryId);
    
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a room's status
// @route   PATCH /api/hotels/:hotelId/categories/:categoryId/rooms/:roomId/status
// @access  Private (Admin/Receptionist)
export const updateRoomStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { categoryId, roomId, hotelId } = req.params;
    const { status } = req.body;

    if (req.user && req.user.role === 'receptionist' && req.user.hotelId) {
      if (hotelId && hotelId !== req.user.hotelId.toString()) {
        res.status(403).json({ message: 'You can only update rooms for your assigned hotel' });
        return;
      }
    }

    if (!['Ready', 'CheckIn', 'HouseKeeping'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const category = await RoomCategory.findById(categoryId);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const room = category.rooms.find((r: any) => r._id.toString() === roomId);
    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    room.status = status;
    await category.save();

    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
