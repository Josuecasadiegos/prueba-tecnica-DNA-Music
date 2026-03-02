// app/api/auth/logout/route.js

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: 'Logout exitoso' 
    });

    // Borra la cookie auth_token
    response.cookies.delete('auth_token', { 
      path: '/', 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json({ 
      error: 'Error al cerrar sesión' 
    }, { status: 500 });
  }
}