import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Subject from '@/models/Subject';

export async function GET() {
  try {
    await connectToDB();
    const subjects = await Subject.find().sort({ name: 1 });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error GET subjects:', error);
    return NextResponse.json({ error: 'Error al obtener materias' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Nombre de materia requerido' }, { status: 400 });
    }

    const existing = await Subject.findOne({ name });
    if (existing) {
      return NextResponse.json({ error: 'La materia ya existe' }, { status: 409 });
    }

    const newSubject = new Subject({ name });
    await newSubject.save();

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error('Error POST subject:', error);
    return NextResponse.json({ error: 'Error al crear materia' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDB();
    const { id, name } = await request.json();

    if (!id || !name) {
      return NextResponse.json({ error: 'ID y nombre requeridos' }, { status: 400 });
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return NextResponse.json({ error: 'Materia no encontrada' }, { status: 404 });
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error PUT subject:', error);
    return NextResponse.json({ error: 'Error al actualizar materia' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDB();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const deleted = await Subject.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Materia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Materia eliminada' });
  } catch (error) {
    console.error('Error DELETE subject:', error);
    return NextResponse.json({ error: 'Error al eliminar materia' }, { status: 500 });
  }
}