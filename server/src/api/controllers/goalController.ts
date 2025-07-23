import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Goal from '../models/GoalModel';

// @desc    Get user's goal
// @route   GET /api/v1/goals
// @access  Private
export const getGoal = asyncHandler(async (req: any, res: Response) => {
    const goal = await Goal.findOne({ user: req.user.id });
    if (goal) {
        res.json(goal);
    } else {
        // If no goal, it's not an error. The user just hasn't set one yet.
        res.json(null);
    }
});

// @desc    Set or update user's goal
// @route   POST /api/v1/goals
// @access  Private
export const setGoal = asyncHandler(async (req: any, res: Response) => {
    const { monthlyBudget } = req.body;

    if (monthlyBudget === undefined) {
        res.status(400);
        throw new Error('Please provide a monthlyBudget');
    }
    
    // Find and update if exists, or create if it doesn't (upsert)
    const goal = await Goal.findOneAndUpdate(
        { user: req.user.id },
        { monthlyBudget },
        { new: true, upsert: true }
    );
    
    res.status(200).json(goal);
});