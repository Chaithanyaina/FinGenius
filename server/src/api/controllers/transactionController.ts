import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Transaction from '../models/TransactionModel';
import mongoose from 'mongoose';

// @desc    Add a new transaction
// @route   POST /api/v1/transactions
// @access  Private
export const addTransaction = asyncHandler(async (req: any, res: Response) => {
    const { type, category, amount, date, description } = req.body;

    if (!type || !category || !amount || !date) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const transaction = new Transaction({
        user: req.user.id,
        type,
        category,
        amount,
        date,
        description
    });

    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
});

// @desc    Get all transactions for a user
// @route   GET /api/v1/transactions
// @access  Private
export const getTransactions = asyncHandler(async (req: any, res: Response) => {
    // Find transactions for the user and sort them by date, newest first.
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    
    res.status(200).json(transactions);
});
export const deleteTransaction = asyncHandler(async (req: any, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid transaction ID');
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Ensure the user owns this transaction
    if (transaction.user.toString() !== req.user.id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await transaction.deleteOne();

    res.status(200).json({ message: 'Transaction removed' });
});
export const updateTransaction = asyncHandler(async (req: any, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid transaction ID');
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Ensure the user owns this transaction
    if (transaction.user.toString() !== req.user.id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    // Update fields with new data from the request body
    const { type, amount, category, date, description } = req.body;
    transaction.type = type || transaction.type;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.date = date || transaction.date;
    transaction.description = description || transaction.description;

    const updatedTransaction = await transaction.save();

    res.status(200).json(updatedTransaction);
});