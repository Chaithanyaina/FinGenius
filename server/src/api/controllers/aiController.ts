import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import OpenAI from 'openai';
import Transaction from '../models/TransactionModel';

// @desc    Get AI-powered financial insights using GPT-4o
// @route   GET /api/v1/ai/insights
// @access  Private
export const getFinancialInsights = asyncHandler(async (req: any, res: Response) => {
    // 1. Initialize the OpenAI client inside the function
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // 2. Fetch user's transactions
    const transactions = await Transaction.find({ user: req.user.id }).limit(30).sort({ date: -1 });

    if (transactions.length === 0) {
        res.status(200).json({ insights: "No transactions found. Add some transactions to get AI insights." });
        return;
    }

    // 3. Create a high-quality prompt for GPT-4o
    const prompt = `
        You are "FinGenius," a friendly and insightful AI financial co-pilot from India, speaking to a user from Guntur, Andhra Pradesh.
        Analyze the following recent financial transactions. Based on this data, provide three unique, actionable, and encouraging financial insights.
        The user's local currency is INR (₹).
        
        - Each insight must start with a relevant emoji (💡, 📈, ✅, 💰, etc.).
        - Keep the tone positive and motivating.
        - Format the response as a single string, with each insight separated by a newline character.

        Here are the user's recent transactions (in JSON format):
        ${JSON.stringify(transactions, null, 2)}
    `;

    try {
        // 4. Call the OpenAI API with the gpt-4o model
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // Specify the new model here
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200, // Increased token limit for potentially more detailed insights
            temperature: 0.7, // A good balance between creativity and consistency
        });
        
        const insights = completion.choices[0].message.content?.trim() || "Could not generate insights at this time.";
        res.status(200).json({ insights });

    } catch (error) {
        console.error('OpenAI API Error:', error);

        if (error instanceof OpenAI.APIError) {
            // Send back the specific status and message from OpenAI
            res.status(error.status || 500);
            throw new Error(`AI Service Error: ${error.message}`);
        } else {
            // For any other kind of error
            res.status(500);
            throw new Error('Failed to communicate with AI service due to an internal server error.');
        }
    }
});