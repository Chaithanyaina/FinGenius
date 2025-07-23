import mongoose, { Document, Model } from 'mongoose';

export interface IGoal extends Document {
    user: mongoose.Types.ObjectId;
    monthlyBudget: number;
}

const goalSchema = new mongoose.Schema<IGoal>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  monthlyBudget: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Goal: Model<IGoal> = mongoose.model<IGoal>('Goal', goalSchema);

export default Goal;