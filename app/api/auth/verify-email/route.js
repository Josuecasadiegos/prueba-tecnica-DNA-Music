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

    // Dominio base del frontend (debe estar definido en las variables de entorno de Vercel)
    const frontendUrl = process.env.FRONTEND_URL || 'https://front-prueba-dna.vercel.app';

    if (!token) {
      return NextResponse.redirect(
        new URL('/verify?error=no-token', frontendUrl)
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Error verificando token:', err.message);
      return NextResponse.redirect(
        new URL('/verify?error=invalid-token', frontendUrl)
      );
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.redirect(
        new URL('/verify?error=user-not-found', frontendUrl)
      );
    }

    if (user.isVerified) {
      return NextResponse.redirect(
        new URL('/verify?already=verified', frontendUrl)
      );
    }

    // Marcar como verificado
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Redirigir a página de éxito bonita en el frontend
    return NextResponse.redirect(
      new URL('/verify-success', frontendUrl)
    );

  } catch (error) {
    console.error('Error verificando email:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'https://front-prueba-dna.vercel.app';
    return NextResponse.redirect(
      new URL('/verify?error=server-error', frontendUrl)
    );
  }
}