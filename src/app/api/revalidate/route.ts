import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || '/edu-network/organisation/school';
  
  try {
    revalidatePath(path);
    revalidatePath('/edu-network/organisation/school');
    revalidatePath('/edu-network/schools');
    revalidatePath('/edu-network/school');
    revalidatePath('/');
    
    return NextResponse.json({
      revalidated: true,
      path,
      purged: [
        path,
        '/edu-network/organisation/school',
        '/edu-network/schools',
        '/edu-network/school',
        '/'
      ],
      timestamp: Date.now()
    });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}
