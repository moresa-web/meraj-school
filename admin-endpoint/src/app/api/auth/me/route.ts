import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { error: 'توکن یافت نشد' },
        { status: 401 }
      );
    }

    const response = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: error.response?.data?.message || 'خطا در دریافت اطلاعات کاربر' },
      { status: error.response?.status || 500 }
    );
  }
} 