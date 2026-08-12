"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBackupCode = exports.verifyLogin2FA = exports.verifySetup2FA = exports.setup2FA = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Receptionist_1 = __importDefault(require("../models/Receptionist"));
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check for Superadmin login (just in case they need to log into reception as superadmin)
        if (email === process.env.SUPERADMIN_EMAIL &&
            password === process.env.SUPERADMIN_PASSWORD) {
            res.json({
                id: 'superadmin',
                name: 'Super Admin',
                email,
                role: 'superadmin',
                permissions: ['hotels', 'global_categories', 'bookings', 'admins', 'archives'], // Super admin has all permissions
                token: generateToken('superadmin', 'superadmin'),
            });
            return;
        }
        // Check for Receptionist login
        const receptionist = await Receptionist_1.default.findOne({ email });
        if (receptionist && (await receptionist.matchPassword(password))) {
            res.json({
                id: receptionist._id,
                name: receptionist.name,
                email: receptionist.email,
                role: receptionist.role,
                permissions: receptionist.permissions,
                hotelId: receptionist.hotelId,
                token: generateToken(receptionist._id.toString(), receptionist.role),
            });
            return;
        }
        res.status(401).json({ message: 'Invalid email or password' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.login = login;
// The 2FA endpoints are kept as empty functions just so we don't break existing routes 
// that might still be mapped to them in authRoutes.ts, even though receptionists don't use 2FA yet.
const setup2FA = async (req, res) => {
    res.status(400).json({ message: '2FA not supported for receptionists' });
};
exports.setup2FA = setup2FA;
const verifySetup2FA = async (req, res) => {
    res.status(400).json({ message: '2FA not supported for receptionists' });
};
exports.verifySetup2FA = verifySetup2FA;
const verifyLogin2FA = async (req, res) => {
    res.status(400).json({ message: '2FA not supported for receptionists' });
};
exports.verifyLogin2FA = verifyLogin2FA;
const verifyBackupCode = async (req, res) => {
    res.status(400).json({ message: '2FA not supported for receptionists' });
};
exports.verifyBackupCode = verifyBackupCode;
