import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    const response = await axios.post(
      `${API_URL}/api/newsletter/${params.id}/send`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'خبرنامه با موفقیت ارسال شد',
      data: response.data.data
    });
  } catch (error: any) {
    console.error('Error sending newsletter:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در ارسال خبرنامه'
      },
      { status: error.response?.status || 500 }
    );
  }
} 