import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const chatId = await params.id;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    if (!chatId) {
      return NextResponse.json(
        { success: false, message: 'شناسه چت نامعتبر است' },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `${API_URL}/api/chat/${chatId}/messages`,
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
    console.error('Error fetching messages:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در دریافت پیام‌ها'
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const chatId = await params.id;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    if (!chatId) {
      return NextResponse.json(
        { success: false, message: 'شناسه چت نامعتبر است' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const response = await axios.post(
      `${API_URL}/api/chat/${chatId}/messages`,
      body,
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
    console.error('Error sending message:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در ارسال پیام'
      },
      { status: error.response?.status || 500 }
    );
  }
} 