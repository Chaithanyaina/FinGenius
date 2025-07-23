import mongoose, { Document, Model } from 'mongoose';

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    date: Date;
    description: string;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, trim: true },
}, { timestamps: true });

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;