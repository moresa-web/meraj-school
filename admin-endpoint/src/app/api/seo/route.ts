import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    const response = await axios.get(`${API_URL}/api/seo`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return NextResponse.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Error fetching SEO data:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در دریافت اطلاعات SEO'
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    const response = await axios.put(`${API_URL}/api/seo`, body, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Error updating SEO data:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در بروزرسانی اطلاعات SEO'
      },
      { status: error.response?.status || 500 }
    );
  }
}