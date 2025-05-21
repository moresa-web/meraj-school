import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;
        
        if (!file) {
            return NextResponse.json(
                { message: 'فایل تصویر یافت نشد' },
                { status: 400 }
            );
        }

        // ارسال درخواست به سرور اصلی
        const mainServerFormData = new FormData();
        mainServerFormData.append('image', file);

        const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: mainServerFormData,
            headers: {
                'Authorization': request.headers.get('Authorization') || ''
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: errorData.message || 'خطا در آپلود تصویر' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in upload route:', error);
        return NextResponse.json(
            { message: 'خطا در پردازش درخواست' },
            { status: 500 }
        );
    }
} 