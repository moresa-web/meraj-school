import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL;

// به‌روزرسانی قالب
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن یافت نشد' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/email-templates/${params.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error('خطا در به‌روزرسانی قالب');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی قالب' },
      { status: 500 }
    );
  }
}

// حذف قالب
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن یافت نشد' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/api/email-templates/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      throw new Error('خطا در حذف قالب');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'خطا در حذف قالب' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'لطفا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const templateId = context.params.id;

    if (!templateId) {
      return NextResponse.json(
        { success: false, message: 'شناسه قالب نامعتبر است' },
        { status: 400 }
      );
    }

    console.log('Sending request to backend:', {
      url: `${API_URL}/api/email-templates/${templateId}`,
      method: 'PATCH',
      body
    });

    const response = await fetch(
      `${API_URL}/api/email-templates/${templateId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(body),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Backend error:', responseData);
      throw new Error(responseData.message || 'خطا در بروزرسانی قالب');
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in PATCH route:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'خطا در بروزرسانی قالب'
      },
      { status: 500 }
    );
  }
} 