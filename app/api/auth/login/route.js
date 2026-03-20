import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectToDB();

    const body = await request.json();
    const { email, password } = body;

    console.log(body)

    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };

    if (!email || !password) {
      const response = NextResponse.json({ error: 'Credenciales requeridas' }, { status: 400 });
      response.cookies.delete('auth_token', cookieOptions);
      return response;
    }

    const user = await User.findOne({ email }).populate('role', 'name');

    if (!user) {
      const response = NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
      response.cookies.delete('auth_token', cookieOptions);
      return response;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const response = NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
      response.cookies.delete('auth_token', cookieOptions);
      return response;
    }

    if (!user.isVerified) {
      const response = NextResponse.json({ error: 'Por favor confirma tu correo primero' }, { status: 403 });
      response.cookies.delete('auth_token', cookieOptions);
      return response;
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
      ...cookieOptions,
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    const response = NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    response.cookies.delete('auth_token', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return response;
  }
}