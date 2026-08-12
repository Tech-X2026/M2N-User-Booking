"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.route('/').post(authMiddleware_1.protect, authMiddleware_1.superadmin, adminController_1.createAdmin).get(authMiddleware_1.protect, authMiddleware_1.superadmin, adminController_1.getAdmins);
router
    .route('/:id')
    .put(authMiddleware_1.protect, authMiddleware_1.superadmin, adminController_1.updateAdmin)
    .delete(authMiddleware_1.protect, authMiddleware_1.superadmin, adminController_1.deleteAdmin);
router.post('/:id/reset-2fa', authMiddleware_1.protect, authMiddleware_1.superadmin, adminController_1.resetAdmin2FA);
exports.default = router;
