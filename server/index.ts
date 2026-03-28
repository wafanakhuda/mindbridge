import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './routes/auth.js';
import { screeningRouter } from './routes/screening.js';
import { appointmentRouter } from './routes/appointments.js';
import { dashboardRouter } from './routes/dashboard.js';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindbridge';
const IS_PROD = process.env.NODE_ENV === 'production' || !!process.env.RAILWAY_ENVIRONMENT;

// Middleware
app.use(cors({ origin: process.env.VITE_APP_URL || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_, res) => res.json({
  status: 'ok',
  db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  env: IS_PROD ? 'production' : 'development',
  timestamp: new Date().toISOString(),
}));

// API Routes
app.use('/api/auth',         authRouter);
app.use('/api/screenings',   screeningRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/dashboard',    dashboardRouter);

// Serve built React frontend in production (single Railway service)
if (IS_PROD) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
  console.log('Serving frontend from:', distPath);
}

// Connect to MongoDB then start
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected:', MONGO_URI.replace(/\/\/.*@/, '//[redacted]@'));
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`MindBridge on port ${PORT} [${IS_PROD ? 'PROD' : 'DEV'}]`);
    });
  })
  .catch(err => {
    console.error('MongoDB FAILED:', err.message);
    process.exit(1);
  });

export default app;
