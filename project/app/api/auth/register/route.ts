export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('geotipico');
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Generate token
    const token = generateToken(result.insertedId.toString(), email);

    return NextResponse.json({
      token,
      user: {
        _id: result.insertedId.toString(),
        name,
        email,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}