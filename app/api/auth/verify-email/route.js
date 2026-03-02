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
      return NextResponse.redirect(new URL('/verify?error=no-token', request.url));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Error verificando token:', err.message);
      return NextResponse.redirect(new URL('/verify?error=invalid-token', request.url));
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.redirect(new URL('/verify?error=user-not-found', request.url));
    }

    if (user.isVerified) {
      return NextResponse.redirect(new URL('/verify?already=verified', request.url));
    }

    // Marcar como verificado
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Redirigir a página de éxito bonita
    return NextResponse.redirect(new URL('/verify-success', request.url));

  } catch (error) {
    console.error('Error verificando email:', error);
    return NextResponse.redirect(new URL('/verify?error=server-error', request.url));
  }
}