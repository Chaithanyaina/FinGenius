import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Transaction from '../models/TransactionModel';
import { subDays, startOfWeek, endOfWeek } from 'date-fns';

// @desc    Generate and get user notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req: any, res: Response) => {
    const notifications: { id: number; message: string; date: Date }[] = [];

    const now = new Date();
    
    // 1. Last Week's Spending Summary
    const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfLastWeek = subDays(startOfThisWeek, 1);
    const startOfLastWeek = startOfWeek(endOfLastWeek, { weekStartsOn: 1 });

    const lastWeekTransactions = await Transaction.find({ 
        user: req.user.id,
        type: 'expense',
        date: { $gte: startOfLastWeek, $lte: endOfLastWeek }
    });

    if (lastWeekTransactions.length > 0) {
        const lastWeekSpend = lastWeekTransactions.reduce((sum, t) => sum + t.amount, 0);
        notifications.push({
            id: 1,
            message: `Last week, you spent a total of ₹${lastWeekSpend.toLocaleString('en-IN')}.`,
            date: new Date()
        });
    }

    // 2. Highest Spending Category in last 30 days
    const last30Days = subDays(now, 30);
    const recentTransactions = await Transaction.find({
        user: req.user.id,
        type: 'expense',
        date: { $gte: last30Days }
    });

    if (recentTransactions.length > 0) {
        const spendingByCategory: { [key: string]: number } = {};
        recentTransactions.forEach(t => {
            spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + t.amount;
        });

        const highestCategory = Object.entries(spendingByCategory)
            .sort(([, a], [, b]) => b - a)[0];

        if (highestCategory) {
            notifications.push({
                id: 2,
                message: `Your highest spending category in the last 30 days was "${highestCategory[0]}" with ₹${highestCategory[1].toLocaleString('en-IN')}.`,
                date: new Date()
            });
        }
    }

    if (notifications.length === 0) {
        notifications.push({
            id: 0,
            message: "Welcome to FinGenius! Add more transactions to start receiving helpful notifications.",
            date: new Date()
        });
    }

    res.status(200).json(notifications);
});