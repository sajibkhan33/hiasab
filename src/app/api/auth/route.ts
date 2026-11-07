import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { action, name, email, password } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email address is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (action === 'register') {
      let user = await UserModel.findOne({ email: cleanEmail });
      if (user) {
        return NextResponse.json({ success: false, message: 'An account with this email already exists' }, { status: 400 });
      }

      user = await UserModel.create({
        name: name ? name.trim() : 'Eng: Sajib Khan',
        email: cleanEmail,
        password: password || '',
        currency: '$',
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
      let user = await UserModel.findOne({ email: cleanEmail });
      if (!user) {
        user = await UserModel.create({
          name: name ? name.trim() : (cleanEmail === 'sajib3323khan@gmail.com' ? 'Eng: Sajib Khan' : (cleanEmail.split('@')[0] || 'User')),
          email: cleanEmail,
          password: password || '',
          currency: '$',
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
      { success: false, message: error.message || 'Authentication error occurred' },
      { status: 500 }
    );
  }
}
