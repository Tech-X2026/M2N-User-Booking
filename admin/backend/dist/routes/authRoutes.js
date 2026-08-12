"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post('/login', authController_1.login);
router.post('/2fa/setup', authController_1.setup2FA);
router.post('/2fa/verify-setup', authController_1.verifySetup2FA);
router.post('/2fa/verify-login', authController_1.verifyLogin2FA);
router.post('/2fa/verify-backup-code', authController_1.verifyBackupCode);
exports.default = router;
