import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { transcript, model } = await request.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required and must be a string' },
        { status: 400 }
      );
    }

    const selectedModel = model || 'meta-llama/llama-3.1-8b-instruct:free';

    const apiKey = process.env.GATEWAYZ_API_KEY;
    const baseUrl = process.env.GATEWAYZ_BASE_URL || 'https://api.gatewayz.ai';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Step 1: Generate Summary
    const summaryResponse = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst expert. Analyze earnings call transcripts and financial reports to extract key information concisely.'
          },
          {
            role: 'user',
            content: `Analyze this earnings call transcript and provide a concise summary covering:
1. Revenue figures and key financial metrics
2. Future guidance and projections
3. Notable quotes from executives
4. Key strategic initiatives or announcements

Transcript:
${transcript}

Provide a structured summary in clear paragraphs.`
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
});

    if (!summaryResponse.ok) {
      const errorText = await summaryResponse.text();
      console.error('Summary API error:', errorText);
      throw new Error(`Summary generation failed: ${summaryResponse.statusText}`);
    }

    const summaryData = await summaryResponse.json();
    const summary = summaryData.choices?.[0]?.message?.content || 'No summary generated';

    // Step 2: Sentiment Analysis
    const sentimentResponse = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: 'You are a financial sentiment analysis expert. Analyze earnings calls to determine market sentiment.'
          },
          {
            role: 'user',
            content: `Analyze the sentiment of this earnings call transcript. Classify it as POSITIVE, NEGATIVE, or NEUTRAL, and provide a brief explanation (2-3 sentences) focusing on:
- Overall outlook and tone
- Executive confidence level
- Market reaction indicators

Transcript:
${transcript}

Format your response as:
Sentiment: [POSITIVE/NEGATIVE/NEUTRAL]
Explanation: [Your explanation]`
          }
        ],
        max_tokens: 500,
        temperature: 0.2,
      }),
    });

    if (!sentimentResponse.ok) {
      const errorText = await sentimentResponse.text();
      console.error('Sentiment API error:', errorText);
      throw new Error(`Sentiment analysis failed: ${sentimentResponse.statusText}`);
    }

    const sentimentData = await sentimentResponse.json();
    const sentimentText = sentimentData.choices?.[0]?.message?.content || 'No sentiment analysis generated';

    // Parse sentiment
    const sentimentMatch = sentimentText.match(/Sentiment:\s*(POSITIVE|NEGATIVE|NEUTRAL)/i);
    const sentiment = sentimentMatch ? sentimentMatch[1].toUpperCase() : 'NEUTRAL';
    const explanation = sentimentText.replace(/Sentiment:\s*(POSITIVE|NEGATIVE|NEUTRAL)\s*/i, '').replace(/Explanation:\s*/i, '').trim();

    return NextResponse.json({
      summary,
      sentiment: {
        classification: sentiment,
        explanation
      },
      usage: {
        summaryTokens: summaryData.usage,
        sentimentTokens: sentimentData.usage
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}
