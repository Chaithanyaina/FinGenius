import express from 'express';
import { getFinancialInsights } from '../controllers/aiController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();
router.post('/insights', protect, getFinancialInsights);

export default router;