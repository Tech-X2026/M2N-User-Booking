"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotelController_1 = require("../controllers/hotelController");
const roomCategoryController_1 = require("../controllers/roomCategoryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const cloudinary_1 = require("../config/cloudinary");
const router = express_1.default.Router();
// Hotel routes
router.route('/')
    .post(authMiddleware_1.protect, cloudinary_1.upload.array('images', 5), hotelController_1.createHotel)
    .get(authMiddleware_1.protect, hotelController_1.getHotels);
router.route('/:id')
    .put(authMiddleware_1.protect, cloudinary_1.upload.array('images', 5), hotelController_1.updateHotel)
    .delete(authMiddleware_1.protect, hotelController_1.deleteHotel);
router.post('/:id/restore', authMiddleware_1.protect, hotelController_1.restoreHotel);
// Approval actions (public)
router.get('/action/approve/:token', hotelController_1.approveAction);
router.get('/action/reject/:token', hotelController_1.rejectAction);
// Room Category routes
router.route('/:hotelId/categories')
    .post(authMiddleware_1.protect, cloudinary_1.upload.fields([{ name: 'images', maxCount: 5 }, { name: 'galleryImages', maxCount: 10 }]), roomCategoryController_1.createRoomCategory)
    .get(authMiddleware_1.protect, roomCategoryController_1.getRoomCategoriesByHotel);
router.route('/:hotelId/categories/:categoryId')
    .put(authMiddleware_1.protect, cloudinary_1.upload.fields([{ name: 'images', maxCount: 5 }, { name: 'galleryImages', maxCount: 10 }]), roomCategoryController_1.updateRoomCategory)
    .delete(authMiddleware_1.protect, roomCategoryController_1.deleteRoomCategory);
router.patch('/:hotelId/categories/:categoryId/rooms/:roomId/status', authMiddleware_1.protect, roomCategoryController_1.updateRoomStatus);
exports.default = router;
