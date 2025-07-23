import express from 'express';
import { getGoal, setGoal } from '../controllers/goalController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getGoal).post(protect, setGoal);

export default router;