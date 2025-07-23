// server/src/api/routes/authRoutes.ts

import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// @route   POST /api/v1/auth/register
// @desc    Register new user
// @access  Public
router.post(
  '/register',
  [
    body('username', 'Username is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

// @route   POST /api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
  ],
  loginUser
);

// @route   GET /api/v1/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

export default router;
