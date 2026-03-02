import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import Role from '@/models/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await connectToDB();
    const { username, email, password, roleName = 'student' } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json({ error: 'Usuario o email ya existe' }, { status: 409 });
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return NextResponse.json({ error: 'Rol no encontrado' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role._id,
      verificationToken,
      verificationTokenExpires: Date.now() + 3600000, 
    });

    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({
      message: 'Usuario registrado. Revisa tu correo para confirmar.',
      user: { username, email },
    }, { status: 201 });

  } catch (error) {
    console.error('Error en register:', error);
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
  }
}