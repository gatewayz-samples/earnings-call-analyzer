import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GATEWAYZ_API_KEY;
    const baseUrl = process.env.GATEWAYZ_BASE_URL || 'https://api.gatewayz.ai';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '100';
    const gateway = searchParams.get('gateway') || 'openrouter';

    const modelsResponse = await fetch(
      `${baseUrl}/v1/models?limit=${limit}&gateway=${gateway}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!modelsResponse.ok) {
      const errorText = await modelsResponse.text();
      console.error('Models API error:', errorText);
      throw new Error(`Failed to fetch models: ${modelsResponse.statusText}`);
    }

    const modelsData = await modelsResponse.json();

    return NextResponse.json(modelsData);

  } catch (error) {
    console.error('Models fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
