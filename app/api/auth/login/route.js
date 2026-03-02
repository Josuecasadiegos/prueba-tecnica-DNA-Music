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

    // Caso 1: Faltan credenciales → borramos cookie y devolvemos error
    if (!username || !password) {
      const response = NextResponse.json(
        { error: 'Credenciales requeridas' },
        { status: 400 }
      );
      response.cookies.delete('auth_token');
      return response;
    }

    // Debug (puedes quitar después)
    console.log('User importado:', User);
    console.log('findOne es función?', typeof User?.findOne === 'function');

    const user = await User.findOne({ username }).populate('role', 'name');

    // Caso 2: Usuario no encontrado → borramos cookie
    if (!user) {
      const response = NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
      response.cookies.delete('auth_token');
      return response;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // Caso 3: Contraseña incorrecta → borramos cookie
    if (!isMatch) {
      const response = NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
      response.cookies.delete('auth_token');
      return response;
    }

    // Caso 4: Usuario no verificado → borramos cookie
    if (!user.isVerified) {
      const response = NextResponse.json(
        { error: 'Por favor confirma tu correo primero' },
        { status: 403 }
      );
      response.cookies.delete('auth_token');
      return response;
    }

    // Solo si todo está correcto → generamos token y seteamos cookie
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
      secure: true,           // correcto para producción (HTTPS)
      sameSite: 'none',       // necesario para cross-origin (frontend y backend separados)
      maxAge: 60 * 60,        // 1 hora
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);

    // Caso 5: Error interno → también borramos la cookie por seguridad
    const response = NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
    response.cookies.delete('auth_token');
    return response;
  }
}