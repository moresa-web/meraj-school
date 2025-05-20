import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// دریافت یک خبر خاص
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    const response = await axios.get(`${API_URL}/api/news/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return NextResponse.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Error fetching news:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'خطا در دریافت خبر'
      },
      { status: error.response?.status || 500 }
    );
  }
}

// ویرایش خبر
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    // چون ممکن است فایل ارسال شود، باید فرم دیتا را پاس بدهیم
    const formData = await request.formData();
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // اگر image فایل باشد، باید به صورت فایل ارسال شود
    const hasFile = formData.get('image') instanceof File;
    let axiosData: any = data;
    let headers: any = {
      'Authorization': `Bearer ${token}`
    };
    if (hasFile) {
      axiosData = formData;
      headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await axios.put(`${API_URL}/api/news/${params.id}`, axiosData, {
      headers
    });

    return NextResponse.json({
      success: true,
      message: 'خبر با موفقیت به‌روزرسانی شد',
      data: response.data
    });
  } catch (error: any) {
    console.error('Error updating news:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'خطا در به‌روزرسانی خبر'
      },
      { status: error.response?.status || 500 }
    );
  }
}

// حذف خبر
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن احراز هویت یافت نشد' },
        { status: 401 }
      );
    }

    const response = await axios.delete(`${API_URL}/api/news/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'خبر با موفقیت حذف شد',
      data: response.data
    });
  } catch (error: any) {
    console.error('Error deleting news:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'خطا در حذف خبر'
      },
      { status: error.response?.status || 500 }
    );
  }
} 