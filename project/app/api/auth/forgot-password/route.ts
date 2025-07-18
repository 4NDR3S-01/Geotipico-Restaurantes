import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('geotipico');
    const users = db.collection('users');

    // Check if user exists
    const user = await users.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: 'Si el email existe en nuestro sistema, recibirás un enlace de restablecimiento',
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = generateToken(user._id.toString(), user.email);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token in database
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetExpires,
        },
      }
    );

    // In a real application, you would send an email here
    // For this demo, we'll return the token (don't do this in production!)
    console.log(`Reset token for ${email}: ${resetToken}`);

    return NextResponse.json({
      message: 'Si el email existe en nuestro sistema, recibirás un enlace de restablecimiento',
      // Remove this in production - only for demo purposes
      resetToken: resetToken,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}