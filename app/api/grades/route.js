import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Grade from '@/models/Grade';

export async function GET() {
  try {
    await connectToDB();
    // Poblar estudiante y materia para mostrar nombres en lugar de solo IDs
    const grades = await Grade.find()
      .populate('student', 'name')
      .populate('subject', 'name')
      .sort({ date: -1 });

    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error GET grades:', error);
    return NextResponse.json({ error: 'Error al obtener notas' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const data = await request.json();

    const { student, subject, grade } = data;
    if (!student || !subject || grade == null) {
      return NextResponse.json({ error: 'Estudiante, materia y nota son requeridos' }, { status: 400 });
    }

    const newGrade = new Grade(data);
    await newGrade.save();

    // Retornar con populate para mejor UX
    const populated = await Grade.findById(newGrade._id)
      .populate('student', 'name')
      .populate('subject', 'name');

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error('Error POST grade:', error);
    return NextResponse.json({ error: 'Error al crear nota' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDB();
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const grade = await Grade.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('student', 'name').populate('subject', 'name');

    if (!grade) {
      return NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 });
    }

    return NextResponse.json(grade);
  } catch (error) {
    console.error('Error PUT grade:', error);
    return NextResponse.json({ error: 'Error al actualizar nota' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDB();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const deleted = await Grade.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Nota eliminada' });
  } catch (error) {
    console.error('Error DELETE grade:', error);
    return NextResponse.json({ error: 'Error al eliminar nota' }, { status: 500 });
  }
}