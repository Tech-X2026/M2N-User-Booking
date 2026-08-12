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
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_xss_sanitizer_1 = require("express-xss-sanitizer");
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const hotelRoutes_1 = __importDefault(require("./routes/hotelRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const globalCategoryRoutes_1 = __importDefault(require("./routes/globalCategoryRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const receptionistRoutes_1 = __importDefault(require("./routes/receptionistRoutes"));
require("./models/User");
require("./models/Hotel");
require("./models/RoomCategory");
require("./models/Receptionist");
dotenv_1.default.config({ override: true });
(0, db_1.default)();
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, express_xss_sanitizer_1.xss)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 800, // limit each IP to 800 requests per windowMs
});
app.use('/api', limiter);
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/hotels', hotelRoutes_1.default);
app.use('/api/public', publicRoutes_1.default);
app.use('/api/global-categories', globalCategoryRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/receptionists', receptionistRoutes_1.default);
// Serve static files from the 'dist' folder (which will contain frontend build)
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../dist/index.html'));
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
