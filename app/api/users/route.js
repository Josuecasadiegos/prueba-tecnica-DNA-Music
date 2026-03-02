import { connectToDB } from '../../../lib/db';
import User from '../../../models/User';
import Role from '../../../models/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    const authResult = await requireAuth(request, ['admin']);

    if (authResult.response) {
        return authResult.response;
    }

    await connectToDB();
    const users = await User.find().populate('role');
    return NextResponse.json(users);
}

export async function POST(request) {
  await connectToDB();
  const { username, password, roleName } = await request.json();

  const role = await Role.findOne({ name: roleName });
  if (!role) return NextResponse.json({ error: 'Rol no encontrado' }, { status: 404 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, role: role._id });
  await newUser.save();

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
  return NextResponse.json({ message: 'Usuario creado', token });
}