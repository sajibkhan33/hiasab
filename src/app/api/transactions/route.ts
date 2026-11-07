import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TransactionModel } from '@/models/Transaction';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
    }

    const transactions = await TransactionModel.find({ userId }).sort({ createdAt: -1 });

    const formatted = transactions.map((t) => ({
      id: t._id.toString(),
      userId: t.userId,
      type: t.type,
      amount: t.amount,
      category: t.category,
      categoryName: t.categoryName || t.category,
      description: t.description,
      paymentMethod: t.paymentMethod,
      date: t.date,
      time: t.time,
      createdAt: new Date(t.createdAt).getTime(),
    }));

    return NextResponse.json({ success: true, transactions: formatted });
  } catch (error: any) {
    console.error('Fetch Transactions Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to retrieve transactions from database' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { userId, type, amount, category, categoryName, description, paymentMethod, date, time } = body;

    if (!userId || !type || !amount || !category || !date) {
      return NextResponse.json({ success: false, message: 'Required transaction fields are missing' }, { status: 400 });
    }

    const newTx = await TransactionModel.create({
      userId,
      type,
      amount: Number(amount),
      category,
      categoryName: categoryName || '',
      description: description || '',
      paymentMethod: paymentMethod || 'cash',
      date,
      time: time || '',
    });

    return NextResponse.json({
      success: true,
      transaction: {
        id: newTx._id.toString(),
        userId: newTx.userId,
        type: newTx.type,
        amount: newTx.amount,
        category: newTx.category,
        categoryName: newTx.categoryName,
        description: newTx.description,
        paymentMethod: newTx.paymentMethod,
        date: newTx.date,
        time: newTx.time,
        createdAt: new Date(newTx.createdAt).getTime(),
      },
    });
  } catch (error: any) {
    console.error('Create Transaction Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to save transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Transaction ID is required' }, { status: 400 });
    }

    const updated = await TransactionModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: updated._id.toString(),
        userId: updated.userId,
        type: updated.type,
        amount: updated.amount,
        category: updated.category,
        categoryName: updated.categoryName,
        description: updated.description,
        paymentMethod: updated.paymentMethod,
        date: updated.date,
        time: updated.time,
        createdAt: new Date(updated.createdAt).getTime(),
      },
    });
  } catch (error: any) {
    console.error('Update Transaction Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Transaction ID is required' }, { status: 400 });
    }

    await TransactionModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error: any) {
    console.error('Delete Transaction Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
