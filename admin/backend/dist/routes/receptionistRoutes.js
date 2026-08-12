"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const receptionistController_1 = require("../controllers/receptionistController");
const router = express_1.default.Router();
console.log('DEBUG receptionistRoutes:', { protect: !!authMiddleware_1.protect, superadmin: !!authMiddleware_1.superadmin, createReceptionist: !!receptionistController_1.createReceptionist });
router
    .route('/')
    .post(authMiddleware_1.protect, authMiddleware_1.superadmin, receptionistController_1.createReceptionist)
    .get(authMiddleware_1.protect, authMiddleware_1.superadmin, receptionistController_1.getReceptionists);
router
    .route('/:id')
    .put(authMiddleware_1.protect, authMiddleware_1.superadmin, receptionistController_1.updateReceptionist)
    .delete(authMiddleware_1.protect, authMiddleware_1.superadmin, receptionistController_1.deleteReceptionist);
exports.default = router;
