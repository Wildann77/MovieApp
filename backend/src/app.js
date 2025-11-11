import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { connectDB } from './lib/mongoDB.js';
import { errorHandler } from './utils/response.js';

// Routes
import authRoutes from './routers/auth.route.js';
import movieRoutes from './routers/movie.route.js';
import masterDataRoutes from './routers/master-data.route.js';
import userRoutes from './routers/user.route.js';
import uploadRoutes from './routers/upload.route.js';
import reviewRoutes from './routers/review.route.js';
import adminRoutes from './routers/admin.route.js';

// Load env for both local and serverless usage
dotenv.config();
if (process.env.NODE_ENV) {
  const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
  dotenv.config({ path: envPath, override: true });
}

// Ensure DB connected once (cached in connectDB)
await connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/master-data', masterDataRoutes);
app.use('/api/user', userRoutes);
app.use('/api', uploadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

export default app;
