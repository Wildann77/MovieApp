// src/app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { connectDB } from './lib/mongoDB.js';
import { errorHandler } from './utils/response.js';

// ROUTES
import authRoutes from './routers/auth.route.js';
import movieRoutes from './routers/movie.route.js';
import masterDataRoutes from './routers/master-data.route.js';
import userRoutes from './routers/user.route.js';
import uploadRoutes from './routers/upload.route.js';
import reviewRoutes from './routers/review.route.js';
import adminRoutes from './routers/admin.route.js';

// Env
dotenv.config();
await connectDB(); // ✅ Vercel akan reuse connection

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://movie-app-nu-green.vercel.app',
  credentials: true,
}));

// ✅ health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend berjalan',
    timestamp: new Date().toISOString(),
  });
});

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/master-data', masterDataRoutes);
app.use('/api/user', userRoutes);
app.use('/api', uploadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// ROOT
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend is up', health: '/api/health' });
});

// ERROR HANDLER
app.use(errorHandler);

export default app; // ✅ Wajib
