// app/api/auth/verify-email/route.js

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    // Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Error verificando token:', err.message);
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'Correo ya verificado anteriormente' });
    }

    // Marcar como verificado y limpiar token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return NextResponse.json({ 
      message: 'Correo verificado exitosamente. Ahora puedes iniciar sesión.' 
    });

  } catch (error) {
    console.error('Error verificando email:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}