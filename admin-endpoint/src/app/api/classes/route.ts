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

    const response = await axios.get(`${API_URL}/api/classes/admin/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return NextResponse.json({
      success: true,
      data: response.data.data
    });
  } catch (error: any) {
    console.error('Error fetching classes:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در دریافت لیست کلاس‌ها',
        data: []
      },
      { status: error.response?.status || 500 }
    );
  }
}

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

    const formData = await request.formData();
    console.log('Create class request form data:', Object.fromEntries(formData));

    const response = await axios.post(`${API_URL}/api/classes`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'کلاس با موفقیت ایجاد شد',
      data: response.data
    });
  } catch (error: any) {
    console.error('Error creating class:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در ایجاد کلاس'
      },
      { status: error.response?.status || 500 }
    );
  }
} 