import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Transaction from '../models/TransactionModel';

// @desc    Get AI-powered financial insights using Gemini Pro
// @route   GET /api/v1/ai/insights
// @access  Private
export const getFinancialInsights = asyncHandler(async (req: any, res: Response) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    
    // --- THIS IS THE FIX ---
    // Change the model name to the latest version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const transactions = await Transaction.find({ user: req.user.id }).limit(20).sort({ date: -1 });

    if (transactions.length === 0) {
        res.status(200).json({ insights: "No transactions found. Add some to get AI insights." });
        return;
    }

    const prompt = `
        You are "FinGenius," an expert financial advisor AI from Guntur, Andhra Pradesh, India.
        Based on the following recent financial transactions (in INR), provide three concise, actionable, and encouraging financial insights for the user.
        Each insight should be a short sentence starting with a relevant emoji (💡, 📈, ✅, 💰, etc.).
        Format the response as a single string with each insight separated by a newline character.

        Here are the user's transactions:
        ${JSON.stringify(transactions, null, 2)}
    `;

    try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    res.status(200).json({ insights });

} catch (error: any) {
    console.error('Gemini API Error:', error);

    // --- THIS IS THE IMPROVED ERROR HANDLING ---
    // Check if the error is a 503 "Service Unavailable"
    if (error.status === 503) {
        res.status(503);
        throw new Error('The AI model is currently overloaded. Please try again in a few moments.');
    } else {
        // For any other kind of error
        res.status(500);
        throw new Error('Failed to communicate with the Gemini AI service.');
    }
}
});