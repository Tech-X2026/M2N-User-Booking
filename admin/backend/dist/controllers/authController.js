"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBackupCode = exports.verifyLogin2FA = exports.verifySetup2FA = exports.setup2FA = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otplib_1 = require("otplib");
const qrcode_1 = __importDefault(require("qrcode"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const generateChallengeToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role, challenge: true }, process.env.JWT_SECRET, {
        expiresIn: '10m', // 10 minutes to finish 2FA
    });
};
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check for Superadmin login
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
        // Check for regular Admin login
        const admin = await prisma_1.default.admin.findUnique({ where: { email } });
        if (admin) {
            const isMatch = await bcryptjs_1.default.compare(password, admin.password);
            if (isMatch) {
                const challengeToken = generateChallengeToken(admin.id, admin.role);
                if (!admin.twoFactorEnabled) {
                    res.json({
                        requiresSetup: true,
                        challengeToken
                    });
                    return;
                }
                res.json({
                    requires2FA: true,
                    challengeToken
                });
                return;
            }
        }
        res.status(401).json({ message: 'Invalid email or password' });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.login = login;
const setup2FA = async (req, res) => {
    try {
        const { challengeToken } = req.body;
        if (!challengeToken) {
            res.status(401).json({ message: 'No challenge token' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(challengeToken, process.env.JWT_SECRET);
        if (!decoded.challenge) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        const admin = await prisma_1.default.admin.findUnique({ where: { id: decoded.id } });
        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }
        if (admin.twoFactorEnabled) {
            res.status(400).json({ message: '2FA is already enabled' });
            return;
        }
        const secret = (0, otplib_1.generateSecret)();
        await prisma_1.default.admin.update({
            where: { id: admin.id },
            data: { twoFactorSecret: secret }
        });
        const otpauthUrl = (0, otplib_1.generateURI)({ issuer: 'M2N Hotels', label: admin.email, secret });
        const qrCodeUrl = await qrcode_1.default.toDataURL(otpauthUrl);
        res.json({ qrCode: qrCodeUrl });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.setup2FA = setup2FA;
const hashToken = (token) => {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
};
const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
        codes.push(crypto_1.default.randomBytes(4).toString('hex').toUpperCase()); // e.g. 8 chars
    }
    return codes;
};
const verifySetup2FA = async (req, res) => {
    try {
        const { challengeToken, code } = req.body;
        const decoded = jsonwebtoken_1.default.verify(challengeToken, process.env.JWT_SECRET);
        const admin = await prisma_1.default.admin.findUnique({ where: { id: decoded.id } });
        if (!admin || !admin.twoFactorSecret) {
            res.status(400).json({ message: 'Invalid setup request' });
            return;
        }
        const result = (0, otplib_1.verify)({ token: code, secret: admin.twoFactorSecret });
        if (!result) {
            res.status(400).json({ message: 'Invalid verification code' });
            return;
        }
        const backupCodes = generateBackupCodes();
        const updatedAdmin = await prisma_1.default.admin.update({
            where: { id: admin.id },
            data: {
                twoFactorBackupCodes: backupCodes.map(c => hashToken(c)),
                twoFactorEnabled: true,
                twoFactorVerified: true,
                twoFactorSetupCompletedAt: new Date()
            }
        });
        res.json({
            id: updatedAdmin.id,
            name: updatedAdmin.name,
            email: updatedAdmin.email,
            role: updatedAdmin.role,
            permissions: updatedAdmin.permissions,
            token: generateToken(updatedAdmin.id, updatedAdmin.role),
            backupCodes // Return only once in plain text
        });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.verifySetup2FA = verifySetup2FA;
const verifyLogin2FA = async (req, res) => {
    try {
        const { challengeToken, code } = req.body;
        const decoded = jsonwebtoken_1.default.verify(challengeToken, process.env.JWT_SECRET);
        const admin = await prisma_1.default.admin.findUnique({ where: { id: decoded.id } });
        if (!admin || !admin.twoFactorSecret) {
            res.status(400).json({ message: 'Invalid login request' });
            return;
        }
        const result = (0, otplib_1.verify)({ token: code, secret: admin.twoFactorSecret });
        if (!result) {
            res.status(400).json({ message: 'Invalid verification code' });
            return;
        }
        res.json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            token: generateToken(admin.id, admin.role),
        });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.verifyLogin2FA = verifyLogin2FA;
const verifyBackupCode = async (req, res) => {
    try {
        const { challengeToken, code } = req.body;
        const decoded = jsonwebtoken_1.default.verify(challengeToken, process.env.JWT_SECRET);
        const admin = await prisma_1.default.admin.findUnique({ where: { id: decoded.id } });
        if (!admin || !admin.twoFactorBackupCodes) {
            res.status(400).json({ message: 'Invalid login request' });
            return;
        }
        const hashedCode = hashToken(code);
        const codeIndex = admin.twoFactorBackupCodes.indexOf(hashedCode);
        if (codeIndex === -1) {
            res.status(400).json({ message: 'Invalid backup code' });
            return;
        }
        const newBackupCodes = [...admin.twoFactorBackupCodes];
        newBackupCodes.splice(codeIndex, 1);
        await prisma_1.default.admin.update({
            where: { id: admin.id },
            data: { twoFactorBackupCodes: newBackupCodes }
        });
        res.json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            token: generateToken(admin.id, admin.role),
        });
    }
    catch (error) {
        res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
    }
};
exports.verifyBackupCode = verifyBackupCode;
