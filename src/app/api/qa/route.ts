import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { transcript, question, model } = await request.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required and must be a string' },
        { status: 400 }
      );
    }

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
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

    // Use AI to answer questions based on the transcript
    const qaResponse = await fetch(`${baseUrl}/v1/chat/completions`, {
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
            content: 'You are a helpful financial analyst assistant. Answer questions about earnings call transcripts accurately and concisely based only on the information provided in the transcript. If the information is not in the transcript, say so.'
          },
          {
            role: 'user',
            content: `Based on the following earnings call transcript, please answer this question: "${question}"

Transcript:
${transcript}

Provide a clear, concise answer. If the transcript doesn't contain information to answer the question, state that explicitly.`
          }
        ],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    if (!qaResponse.ok) {
      const errorText = await qaResponse.text();
      console.error('Q&A API error:', errorText);
      throw new Error(`Q&A failed: ${qaResponse.statusText}`);
    }

    const qaData = await qaResponse.json();
    const answer = qaData.choices?.[0]?.message?.content || 'No answer generated';

    return NextResponse.json({
      question,
      answer,
      usage: qaData.usage
    });

  } catch (error) {
    console.error('Q&A error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Q&A failed' },
      { status: 500 }
    );
  }
}
