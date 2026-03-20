import { connectToDB } from '../../../lib/db';
import User from '../../../models/User';
import Role from '../../../models/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  const authResult = await requireAuth(request, ['admin']);

  if (authResult.response) {
    return authResult.response;
  }

  await connectToDB();
  const users = await User.find().populate('role');
  return NextResponse.json(users);
}

export async function POST(request) {
  try {
    await connectToDB();

    const { username, email, password, roleName } = await request.json();

    // 🔴 Validación básica
    if (!username || !email || !password || !roleName) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // 🔴 Verificar si ya existe el usuario
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'El usuario o email ya existe' },
        { status: 400 }
      );
    }

    // 🔴 Buscar rol
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Rol no encontrado' },
        { status: 404 }
      );
    }

    // 🔐 Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧠 Crear usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role._id,
      isVerified: true, // opcional
    });

    await newUser.save();

    // 🔐 Token opcional
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET
    );

    // ✅ RESPUESTA CON NOTIFICACIÓN
    return NextResponse.json({
      success: true,
      message: 'Usuario creado correctamente ✅',
      user: {
        username: newUser.username,
        email: newUser.email,
        role: role.name,
      },
      token,
    });

  } catch (error) {
    console.error('Error creando usuario:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      { status: 500 }
    );
  }
}