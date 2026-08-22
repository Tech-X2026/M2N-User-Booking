"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_xss_sanitizer_1 = require("express-xss-sanitizer");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
dotenv_1.default.config({ override: true });
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : false)
        : '*',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, express_xss_sanitizer_1.xss)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 800, // limit each IP to 800 requests per windowMs
});
app.use('/api', limiter);
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
// Serve static files from the 'dist' folder (which will contain frontend build)
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../dist/index.html'));
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Main Backend Server running on port ${PORT}`);
});
