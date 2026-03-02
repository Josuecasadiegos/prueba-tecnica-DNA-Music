// lib/auth.js  ← usa import/export (ESM)

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en .env');
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  });
}

export async function getCurrentUser(req = null) {
  let token;

  if (req) {
    token = req.cookies.get('auth_token')?.value;
  } else {
    const cookieStore = cookies();
    token = cookieStore.get('auth_token')?.value;
  }

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error('Token inválido o expirado:', err.message);
    return null;
  }
}

export async function requireAuth(req, allowedRoles = null) {
  const user = await getCurrentUser(req);

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: 'No autenticado' }, { status: 401 }),
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      user: null,
      response: NextResponse.json({ error: 'No autorizado (rol insuficiente)' }, { status: 403 }),
    };
  }

  return { user, response: undefined };
}