import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      redirect: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}