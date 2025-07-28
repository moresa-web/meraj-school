import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'ایمیل الزامی است' },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${API_URL}/api/newsletter/subscribe`,
      { email },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در افزودن مشترک'
      },
      { status: error.response?.status || 500 }
    );
  }
} 