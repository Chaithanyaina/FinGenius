import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel';
import generateToken from '../../utils/generateToken';
import { validationResult } from 'express-validator'; // <-- Import


// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req); // <-- Check for errors
    if (!errors.isEmpty()) {
        res.status(400); // Bad Request
        // Return the array of errors to the frontend
        throw new Error(errors.array().map(e => e.msg).join(', '));
    }
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    // We don't log the user in automatically, just confirm registration
    res.status(201).json({
      message: 'User registered successfully. Please login.',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req); // <-- Check for errors
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errors.array().map(e => e.msg).join(', '));
    }
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      user: {
        // --- FIX ---
        id: user.id, 
        username: user.username,
        email: user.email,
      },
      // --- FIX ---
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: any, res: Response) => {
    // The user is attached to the request in the `protect` middleware
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});