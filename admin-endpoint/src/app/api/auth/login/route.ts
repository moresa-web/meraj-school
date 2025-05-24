import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Login request body:', body);
    
    const response = await axios.post(`${API_URL}/api/auth/login`, body);
    console.log('Login response:', response.data);

    if (response.data.token) {
      // ایجاد پاسخ با کوکی
      const res = NextResponse.json({
        success: true,
        message: 'ورود موفقیت‌آمیز',
        token: response.data.token
      });

      // تنظیم کوکی با امنیت مناسب
      res.cookies.set('auth_token', response.data.token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 روز
        path: '/'
      });

      return res;
    }

    return NextResponse.json({
      success: false,
      message: response.data.message || 'خطا در ورود به سیستم'
    });
  } catch (error: any) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'خطا در ورود به سیستم'
      },
      { status: error.response?.status || 500 }
    );
  }
} 