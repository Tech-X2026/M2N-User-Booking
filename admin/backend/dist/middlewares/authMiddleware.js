"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superadmin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (decoded.role === 'superadmin') {
                req.user = { id: 'superadmin', role: 'superadmin', email: process.env.SUPERADMIN_EMAIL };
            }
            else {
                req.user = await Admin_1.default.findById(decoded.id).select('-password');
            }
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
exports.protect = protect;
const superadmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Not authorized as superadmin' });
    }
};
exports.superadmin = superadmin;
