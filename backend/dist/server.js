"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const path_1 = __importDefault(require("path"));
const kycSyncJob_1 = require("./jobs/kycSyncJob");
const revenueJob_1 = require("./jobs/revenueJob");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://digirealassets.io",
    "http://localhost:5173",
    "http://localhost:5174"
].filter((o) => Boolean(o));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.options("*", (0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use('/api/v1', routes_1.default);
app.use(errorHandler_1.errorHandler);
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
if (process.env.NODE_ENV === 'production') {
    console.log('Starting PRODUCTION cron jobs...');
    (0, kycSyncJob_1.startKycSyncJob)();
    (0, revenueJob_1.startRevenueJob)();
}
else if (process.env.ENABLE_TEST_CRON === 'true') {
    console.log('Starting TEST cron jobs...');
    (0, kycSyncJob_1.startKycSyncJobTest)();
    (0, revenueJob_1.startRevenueJob)();
}
else {
    console.log('Cron jobs disabled in development');
}
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log(' Server Started Successfully!');
    console.log('='.repeat(60));
    console.log(` PORT:          ${PORT}`);
    console.log(` ENVIRONMENT:   ${process.env.NODE_ENV || 'development'}`);
    console.log(` BACKEND_URL:   ${BACKEND_URL}`);
    console.log(` API BASE:      ${BACKEND_URL}/api/v1`);
    console.log('='.repeat(60));
    if (allowedOrigins.length > 0) {
        console.log('\nCORS Allowed Origins:');
        allowedOrigins.forEach(origin => console.log(`   ✓ ${origin}`));
    }
    console.log('\n⛓️ Blockchain Configuration:');
    console.log(`   RPC URL:    ${process.env.RPC_URL || 'Not configured'}`);
    console.log(`   Network:    ${process.env.BLOCCKCHAIN_NETWORK || 'Not specified'}`);
    console.log(`   Admin Key:  ${process.env.PRIVATE_KEY ? '✓ Configured' : '✗ Missing'}`);
    console.log('\n' + '='.repeat(60) + '\n');
});
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
function gracefulShutdown() {
    console.log('\nShutdown signal received. Closing server gracefully...');
    process.exit(0);
}
process.on('uncaughtException', (error) => {
    console.error('UNCAUGHT EXCEPTION:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:');
    console.error('Promise:', promise);
    console.error('Reason:', reason);
});
exports.default = app;
//# sourceMappingURL=server.js.map