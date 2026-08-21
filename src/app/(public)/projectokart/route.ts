import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://projectokart.com', { status: 308 });
}
