import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('geotipico');
    const users = db.collection('users');

    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Nuevo: actualizar usuario autenticado
export async function PUT(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }
    const token = authorization.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    const { name, email } = await request.json();
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db('geotipico');
    const users = db.collection('users');
    // Verificar si el email ya existe en otro usuario
    const existing = await users.findOne({ email, _id: { $ne: new ObjectId(decoded.userId) } });
    if (existing) {
      return NextResponse.json(
        { error: 'El email ya está en uso por otro usuario.' },
        { status: 409 }
      );
    }
    // Actualizar usuario
    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(decoded.userId) },
      { $set: { name, email } },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      _id: result.value._id.toString(),
      name: result.value.name,
      email: result.value.email,
      createdAt: result.value.createdAt,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}