// server/src/server.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { notFound, errorHandler } from './api/middlewares/errorHandler';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './api/routes/authRoutes';
import transactionRoutes from './api/routes/transactionRoutes';
import goalRoutes from './api/routes/goalRoutes';
import userRoutes from './api/routes/userRoutes';
import aiRoutes from './api/routes/aiRoutes';

dotenv.config();
connectDB();

const app = express();

// --- THIS IS THE FIX ---
// Trust the first proxy in front of the app (Render's proxy)
app.set('trust proxy', 1);

// --- Simplified and More Direct CORS Configuration ---
const allowedOrigins = [
    'http://localhost:5173',
    'https://fin-genius-topaz.vercel.app'
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
};

// Use the cors middleware with our options
app.use(cors(corsOptions));

// --- Other Middleware ---
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// --- API Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/ai', aiRoutes);

// --- Final Middleware ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
