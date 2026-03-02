import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Student from '@/models/Student';

export async function GET() {
  try {
    await connectToDB();
    const students = await Student.find().sort({ name: 1 });
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error GET students:', error);
    return NextResponse.json({ error: 'Error al obtener estudiantes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDB();
    const data = await request.json();

    const { name } = data;
    if (!name) {
      return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
    }

    const newStudent = new Student(data);
    await newStudent.save();

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error POST student:', error);
    return NextResponse.json({ error: 'Error al crear estudiante' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDB();
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!student) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error PUT student:', error);
    return NextResponse.json({ error: 'Error al actualizar estudiante' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDB();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Estudiante eliminado' });
  } catch (error) {
    console.error('Error DELETE student:', error);
    return NextResponse.json({ error: 'Error al eliminar estudiante' }, { status: 500 });
  }
}