import express from 'express';
import { getFinancialInsights } from '../controllers/aiController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/insights', protect, getFinancialInsights);

export default router;