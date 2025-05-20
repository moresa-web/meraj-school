import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL;

// دریافت همه قالب‌ها
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن یافت نشد' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/api/email-templates`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      throw new Error('خطا در دریافت قالب‌ها');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت قالب‌ها' },
      { status: 500 }
    );
  }
}

// ایجاد قالب جدید
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن یافت نشد' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_URL}/api/email-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('خطا در ایجاد قالب');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد قالب' },
      { status: 500 }
    );
  }
} 