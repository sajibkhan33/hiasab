import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  categoryName?: string;
  description: string;
  paymentMethod: string;
  date: string;
  time?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    categoryName: { type: String, default: '' },
    description: { type: String, default: '' },
    paymentMethod: { type: String, default: 'cash' },
    date: { type: String, required: true, index: true },
    time: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const TransactionModel: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
