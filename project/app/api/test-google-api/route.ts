import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testUrl = searchParams.get('url');
  
  if (!testUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  
  try {
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (data.status === 'OK') {
      return NextResponse.json({ 
        success: true, 
        message: 'API key is valid',
        data: data 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: data.error_message || data.status,
        data: data
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: `Network error: ${error}` 
    }, { status: 500 });
  }
}
