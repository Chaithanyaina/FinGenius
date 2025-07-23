import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel';
import generateToken from '../../utils/generateToken'; // <-- ADD

// @desc    Get user profile
// @route   GET /api/v1/user/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/v1/user/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        
        // Return updated info and a new token to keep session valid
        res.json({
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            token: generateToken(updatedUser.id), // <-- ADD THIS LINE
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});