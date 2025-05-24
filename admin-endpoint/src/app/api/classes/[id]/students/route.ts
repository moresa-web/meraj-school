import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'لطفا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const students = await db
      .collection('students')
      .find({ classId: params.id })
      .toArray();

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { message: 'خطا در دریافت لیست دانش‌آموزان' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'لطفا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { studentName, studentPhone, parentPhone, grade, isActive } = body;

    if (!studentName || !studentPhone || !parentPhone || !grade) {
      return NextResponse.json(
        { message: 'لطفا تمام فیلدهای الزامی را پر کنید' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const student = {
      studentName,
      studentPhone,
      parentPhone,
      grade,
      isActive: isActive ?? true,
      classId: params.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('students').insertOne(student);
    student._id = result.insertedId;

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { message: 'خطا در ایجاد دانش‌آموز' },
      { status: 500 }
    );
  }
} 