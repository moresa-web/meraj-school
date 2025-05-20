import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = await cookieStore.get('auth_token');

  if (!token) {
    return NextResponse.json({ error: 'توکن یافت نشد' }, { status: 401 });
  }

  return NextResponse.json({ token: token.value });
} 