"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalCategoryController_1 = require("../controllers/globalCategoryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .post(authMiddleware_1.protect, globalCategoryController_1.createGlobalCategory)
    .get(authMiddleware_1.protect, globalCategoryController_1.getGlobalCategories);
router.route('/:id')
    .put(authMiddleware_1.protect, globalCategoryController_1.updateGlobalCategory)
    .delete(authMiddleware_1.protect, globalCategoryController_1.archiveGlobalCategory);
router.route('/:id/restore')
    .put(authMiddleware_1.protect, globalCategoryController_1.restoreGlobalCategory);
exports.default = router;
