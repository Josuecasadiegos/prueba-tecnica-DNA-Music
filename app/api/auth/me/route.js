import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    return NextResponse.json({ 
      user: {
        username: user.username,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Error en /me:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}