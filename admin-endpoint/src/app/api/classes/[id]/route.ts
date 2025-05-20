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

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    const response = await axios.get(`${API_URL}/api/classes/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return NextResponse.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Error fetching class:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در دریافت اطلاعات کلاس'
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(
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

    // دریافت FormData از درخواست
    const formData = await request.formData();
    console.log('Update class request form data:', Object.fromEntries(formData));

    // بررسی وجود فایل در FormData
    const hasFile = formData.get('image') instanceof File;
    let axiosData: any = formData;
    let headers: any = {
      'Authorization': `Bearer ${token}`
    };

    // اگر فایل وجود دارد، هدر Content-Type را تنظیم می‌کنیم
    if (hasFile) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await axios.put(`${API_URL}/api/classes/${params.id}`, axiosData, {
      headers
    });

    return NextResponse.json({
      success: true,
      message: 'کلاس با موفقیت به‌روزرسانی شد',
      data: response.data
    });
  } catch (error: any) {
    console.error('Error updating class:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در به‌روزرسانی کلاس'
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(
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

    const response = await axios.delete(`${API_URL}/api/classes/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'کلاس با موفقیت حذف شد',
      data: response.data
    });
  } catch (error: any) {
    console.error('Error deleting class:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'خطا در حذف کلاس'
      },
      { status: error.response?.status || 500 }
    );
  }
} 