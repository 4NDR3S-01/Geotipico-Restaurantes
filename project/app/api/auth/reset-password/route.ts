import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { hashPassword, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('geotipico');
    const users = db.collection('users');

    // Find user with valid reset token
    const user = await users.findOne({
      _id: new ObjectId(decoded.userId),
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and remove reset token
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetPasswordToken: '',
          resetPasswordExpires: '',
        },
      }
    );

    return NextResponse.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}