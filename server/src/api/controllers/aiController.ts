import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Transaction from '../models/TransactionModel';

export const getFinancialInsights = asyncHandler(async (req: any, res: Response) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const { question } = req.body;

    const transactions = await Transaction.find({ user: req.user.id })
        .limit(50)
        .sort({ date: -1 });

    if (transactions.length === 0) {
        res.status(200).json({ insights: "No transactions found. Add some to get AI insights." });
        return;
    }

    // --- PROMPT REFINEMENT ---
    const basePrompt = `
        You are "FinGenius," an expert financial advisor AI from Guntur, Andhra Pradesh, India.
        Based on the following recent financial transactions (in INR), answer the user's request.
        The user's local currency is INR (₹).

        IMPORTANT: Keep your answer concise and limit it to a single, helpful paragraph.

        Here are the user's recent transactions:
        ${JSON.stringify(transactions, null, 2)}
    `;

    const userQuery = question
        ? `The user's specific question is: "${question}"`
        : "The user wants general insights. Please provide a brief summary of their recent spending and two unique, actionable financial tips, each starting with an emoji (💡, 📈, ✅, 💰, etc.).";

    const finalPrompt = `${basePrompt}\n\n${userQuery}`;

    try {
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const insights = response.text();

        res.status(200).json({ insights });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        if (error.status === 503) {
            res.status(503);
            throw new Error('The AI model is currently overloaded. Please try again in a few moments.');
        } else {
            res.status(500);
            throw new Error('Failed to communicate with the Gemini AI service.');
        }
    }
});
