import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { notFound, errorHandler } from './api/middlewares/errorHandler';
import authRoutes from './api/routes/authRoutes';
import transactionRoutes from './api/routes/transactionRoutes';
import userRoutes from './api/routes/userRoutes'; // <-- ADD
import aiRoutes from './api/routes/aiRoutes';     // <-- ADD
import goalRoutes from './api/routes/goalRoutes'; // <-- ADD
import helmet from 'helmet'; // <-- Import
import rateLimit from 'express-rate-limit'; // <-- Import

dotenv.config();

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});
app.get('/api', (req, res) => {
  res.send('API is running...');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/user', userRoutes); // <-- ADD
app.use('/api/v1/ai', aiRoutes);     // <-- ADD
app.use('/api/v1/goals', goalRoutes); // <-- ADD


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));