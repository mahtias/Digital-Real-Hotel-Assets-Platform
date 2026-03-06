// backend/src/server.ts

// Load environment variables BEFORE anything else
import dotenv from "dotenv";
dotenv.config(); // loads .env

// --------------------------
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import path from "path";
import { startKycSyncJob, startKycSyncJobTest } from './jobs/kycSyncJob';

// Express app
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins: string[] = [
  process.env.FRONTEND_URL,
  "https://digirealassets.io", 
  "http://localhost:5173",
  "http://localhost:5174"
].filter((o): o is string => Boolean(o));

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);

app.options("*", cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// API Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// ============================================================
// 🔄 START CRON JOBS
// ============================================================

// Start KYC sync job based on environment
if (process.env.NODE_ENV === 'production') {
  console.log('\n Starting PRODUCTION cron jobs...');
  startKycSyncJob(); // Every hour
  console.log('✅ KYC sync job: Running every hour\n');
  
} else if (process.env.ENABLE_TEST_CRON === 'true') {
  console.log('\n🧪 Starting TEST cron jobs...');
  startKycSyncJobTest(); // Every minute (for testing)
  console.log(' KYC sync job: Running every minute (TEST MODE)\n');
  
} else {
  console.log('\n⏸  Cron jobs disabled in development');
  console.log('💡 To enable test cron (runs every minute):');
  console.log('   Add ENABLE_TEST_CRON=true to your .env file\n');
  console.log('💡 To manually trigger KYC sync:');
  console.log('   POST http://localhost:5000/api/v1/admin/kyc/sync\n');
}

// ============================================================
// 🚀 START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(' Server Started Successfully!');
  console.log('='.repeat(60));
  console.log(` Port:        ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL:         http://localhost:${PORT}`);
  console.log(`📡 API:         http://localhost:${PORT}/api/v1`);
  console.log('='.repeat(60));
  
  // Show allowed CORS origins
  if (allowedOrigins.length > 0) {
    console.log('\n CORS Allowed Origins:');
    allowedOrigins.forEach(origin => {
      console.log(`   ✓ ${origin}`);
    });
  }
  
  // Show blockchain connection status
  console.log('\n⛓️  Blockchain Configuration:');
  console.log(`   RPC URL:    ${process.env.RPC_URL || 'Not configured'}`);
  console.log(`   Network:    ${process.env.BLOCCKCHAIN_NETWORK || 'Not specified'}`);
  console.log(`   Admin Key:  ${process.env.PRIVATE_KEY ? '✓ Configured' : '✗ Missing'}`);
  
  console.log('\n' + '='.repeat(60) + '\n');
});

// ============================================================
// 💣 GRACEFUL SHUTDOWN
// ============================================================

// Handle shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

function gracefulShutdown() {
  console.log('\n\n  Shutdown signal received');
  console.log(' Closing server gracefully...');
  
  // Close server
  process.exit(0);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('\n UNCAUGHT EXCEPTION:');
  console.error(error);
  console.log(' Shutting down...');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n UNHANDLED REJECTION:');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
});

export default app;
