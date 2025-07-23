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

app.use(helmet());

// --- THIS IS THE FIX ---
// Add your live Vercel URL to the list of allowed origins
const allowedOrigins = [
    'http://localhost:5173',
    'https://fin-genius-topaz.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.get('/api', (req, res) => {
  res.send('API is running...');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));