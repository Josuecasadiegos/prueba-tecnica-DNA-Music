// app/api/auth/login/route.js

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Credenciales requeridas' }, { status: 400 });
    }

    // Debug (puedes quitar después)
    console.log('User importado:', User);
    console.log('findOne es función?', typeof User?.findOne === 'function');

    const user = await User.findOne({ username }).populate('role', 'name');
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: 'Por favor confirma tu correo primero' }, { status: 403 });
    }

    const token = signToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role.name,
    });

    const response = NextResponse.json({
      message: 'Login exitoso',
      user: { username: user.username, role: user.role.name },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}