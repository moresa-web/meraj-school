import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string; studentId: string } }
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
      updatedAt: new Date()
    };

    const result = await db.collection('students').updateOne(
      { _id: new ObjectId(params.studentId), classId: params.id },
      { $set: student }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'دانش‌آموز مورد نظر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...student, _id: params.studentId });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { message: 'خطا در به‌روزرسانی اطلاعات دانش‌آموز' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; studentId: string } }
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
    const result = await db.collection('students').deleteOne({
      _id: new ObjectId(params.studentId),
      classId: params.id
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'دانش‌آموز مورد نظر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'دانش‌آموز با موفقیت حذف شد' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { message: 'خطا در حذف دانش‌آموز' },
      { status: 500 }
    );
  }
} 