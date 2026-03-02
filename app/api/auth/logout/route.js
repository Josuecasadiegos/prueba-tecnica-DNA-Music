import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout exitoso' });

  response.cookies.delete('auth_token', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  return response;
}