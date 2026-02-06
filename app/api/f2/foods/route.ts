export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_BASE_URL || 'https://api.fammy.pet';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || '';
  
  if (query.length < 2) {
    return NextResponse.json({ foods: [] });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/foods/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({ foods: data.data.foods || [] });
    }
    return NextResponse.json({ foods: [] });
  } catch (error) {
    console.error('Food search error:', error);
    return NextResponse.json({ foods: [] });
  }
}
