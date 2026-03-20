import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    const frontendUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!frontendUrl) {
      console.error('FRONTEND_URL no está definido en env vars');
      return NextResponse.json({ error: 'Configuración del servidor inválida' }, { status: 500 });
    }

    if (!token) {
      return NextResponse.redirect(`${frontendUrl}verify?error=no-token`);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Error verificando token:', err.message);
      return NextResponse.redirect(`${frontendUrl}verify?error=invalid-token`);
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.redirect(`${frontendUrl}verify?error=user-not-found`); 
    }

    if (user.isVerified) {
      return NextResponse.redirect(`${frontendUrl}verify?already=verified`);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    await Notification.create({
      type: 'user_verified',
      message: `Usuario ${user.email} fue verificado`,
    });

    return NextResponse.redirect(`${frontendUrl}verify-success`);

  } catch (error) {
    console.error('Error verificando email:', error);
    const frontendUrl = process.env.FRONTEND_URL;
    return NextResponse.redirect(`${frontendUrl}verify?error=server-error`);
  }
}