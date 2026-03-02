import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';        // ajusta la ruta según tu estructura
import Role from '@/models/Role';

export async function GET() {
  try {
    await connectToDB();
    const roles = await Role.find().sort({ name: 1 });
    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error GET roles:', error);
    return NextResponse.json({ error: 'Error al obtener roles' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'El nombre del rol es requerido' }, { status: 400 });
    }

    const existing = await Role.findOne({ name });
    if (existing) {
      return NextResponse.json({ error: 'El rol ya existe' }, { status: 409 });
    }

    const newRole = new Role({ name });
    await newRole.save();

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error('Error POST role:', error);
    return NextResponse.json({ error: 'Error al crear rol' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDB();
    const { id, name } = await request.json();

    if (!id || !name) {
      return NextResponse.json({ error: 'ID y nombre son requeridos' }, { status: 400 });
    }

    const role = await Role.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!role) {
      return NextResponse.json({ error: 'Rol no encontrado' }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error('Error PUT role:', error);
    return NextResponse.json({ error: 'Error al actualizar rol' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDB();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const deleted = await Role.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Rol no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Rol eliminado' });
  } catch (error) {
    console.error('Error DELETE role:', error);
    return NextResponse.json({ error: 'Error al eliminar rol' }, { status: 500 });
  }
}