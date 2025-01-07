import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Add timeout and retry logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch('http://localhost:8001/api/research', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Backend responded with status ${response.status}: ${errorData.detail || 'Unknown error'}`);
      }

      // Handle streaming response
      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('text/event-stream')) {
        return new Response(response.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error: any) {
    console.error('Research API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process research request',
        details: error.cause?.message || error.cause?.code || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 