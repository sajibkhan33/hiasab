import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { action, name, email, password } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (action === 'register') {
      let user = await UserModel.findOne({ email: cleanEmail });
      if (user) {
        return NextResponse.json({ success: false, message: 'এই ইমেইল দিয়ে ইতোমধ্যে একাউন্ট খোলা আছে' }, { status: 400 });
      }

      user = await UserModel.create({
        name: name ? name.trim() : 'ব্যবহারকারী',
        email: cleanEmail,
        password: password || '',
        currency: '৳',
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          currency: user.currency,
        },
      });
    } else {
      // Login or auto create demo user
      let user = await UserModel.findOne({ email: cleanEmail });
      if (!user) {
        // If not found, create seamless user
        user = await UserModel.create({
          name: name ? name.trim() : cleanEmail.split('@')[0] || 'ব্যবহারকারী',
          email: cleanEmail,
          password: password || '',
          currency: '৳',
        });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          currency: user.currency,
        },
      });
    }
  } catch (error: any) {
    console.error('Auth API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'সার্ভার এরর হয়েছে' },
      { status: 500 }
    );
  }
}
