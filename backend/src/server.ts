// backend/src/server.ts

import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import path from "path";
import { startKycSyncJob, startKycSyncJobTest } from './jobs/kycSyncJob';
import { startRevenueJob } from './jobs/revenueJob'; 

// --------------------------
// Express app & port
// --------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// --------------------------
// Backend URL for logs
// --------------------------
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

// --------------------------
// CORS setup
// --------------------------
const allowedOrigins: string[] = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "https://digirealassets.io",
  "http://localhost:5173",
  "http://localhost:5174"
].filter((o): o is string => Boolean(o));

app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.options("*", cors());

// --------------------------
// Logging & body parser
// --------------------------
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------
// Static files
// --------------------------
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --------------------------
// API Routes
// --------------------------
app.use('/api/v1', routes);

// --------------------------
// Error handling & 404
// --------------------------
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --------------------------
// Start Cron Jobs
// --------------------------
if (process.env.NODE_ENV === 'production') {
  console.log('Starting PRODUCTION cron jobs...');
  startKycSyncJob(); // every hour
  startRevenueJob(); 
} else if (process.env.ENABLE_TEST_CRON === 'true') {
  console.log('Starting TEST cron jobs...');
  startKycSyncJobTest(); // every minute
  startRevenueJob();  
} else {
  console.log('Cron jobs disabled in development');
}

// --------------------------
// Start server
// --------------------------
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

// --------------------------
// Graceful shutdown
// --------------------------
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

function gracefulShutdown() {
  console.log('\nShutdown signal received. Closing server gracefully...');
  process.exit(0);
}

// --------------------------
// Uncaught errors & rejections
// --------------------------
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
});

export default app;