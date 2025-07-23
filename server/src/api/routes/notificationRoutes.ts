import express from 'express';
import { getNotifications } from '../controllers/notificationController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getNotifications);

export default router;