import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    const response = await axios.get(
      `${API_URL}/api/newsletter`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: response.data.data
    });
  } catch (error: any) {
    console.error('Error fetching newsletters:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در دریافت لیست خبرنامه‌ها'
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await axios.post(
      `${API_URL}/api/newsletter`,
      body,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'خبرنامه با موفقیت ایجاد شد',
      data: response.data.data
    });
  } catch (error: any) {
    console.error('Error creating newsletter:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در ایجاد خبرنامه'
      },
      { status: error.response?.status || 500 }
    );
  }
} 