import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    const response = await axios.patch(
      `${API_URL}/api/newsletter/subscribers/${params.id}/activate`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Error activating subscriber:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در فعال‌سازی مشترک'
      },
      { status: error.response?.status || 500 }
    );
  }
} 