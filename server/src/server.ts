import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import connectDB from './config/db';
import { notFound, errorHandler } from './api/middlewares/errorHandler';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './api/routes/authRoutes';
import transactionRoutes from './api/routes/transactionRoutes';
import goalRoutes from './api/routes/goalRoutes';
import userRoutes from './api/routes/userRoutes';
import aiRoutes from './api/routes/aiRoutes';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
    'http://localhost:5173',
    'https://fin-genius-topaz.vercel.app'
];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
};

// --- Middleware Setup ---

// 1. Basic Security
app.use(helmet());

// 2. Enable CORS with preflight handling
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
app.use(cors(corsOptions)); // Enable CORS for all other requests

// 3. Body Parser
app.use(express.json());

// 4. Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter); // Apply the rate limiting middleware to all API routes

// 5. API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/ai', aiRoutes);

// --- Final Middleware ---

// 6. 404 Not Found Handler
app.use(notFound);

// 7. Generic Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));