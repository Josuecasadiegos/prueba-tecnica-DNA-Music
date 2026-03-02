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

    // Usa variable de entorno para el frontend (agrega en Vercel del backend)
    const frontendBase = process.env.FRONTEND_URL || 'https://prueba-tecnica-dna-music-josuecasadiegos-projects.vercel.app';

    if (!token) {
      return NextResponse.redirect(`${frontendBase}/verify?error=no-token`, 302); // o deja 307
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Error verificando token:', err.message);
      return NextResponse.redirect(`${frontendBase}/verify?error=invalid-token`, 302);
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.redirect(`${frontendBase}/verify?error=user-not-found`, 302);
    }

    if (user.isVerified) {
      return NextResponse.redirect(`${frontendBase}/verify?already=verified`, 302);
    }

    // Marcar como verificado
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return NextResponse.redirect(`${frontendBase}/verify-success`, 302);

  } catch (error) {
    console.error('Error verificando email:', error);
    const frontendBase = process.env.FRONTEND_URL || 'https://prueba-tecnica-dna-music-josuecasadiegos-projects.vercel.app';
    return NextResponse.redirect(`${frontendBase}/verify?error=server-error`, 302);
  }
}