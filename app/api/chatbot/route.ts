import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY || "";
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data.choices[0].message.content;
    return NextResponse.json({ reply: botReply });
  } catch (err) {
    const error = err as AxiosError;

    // Safely access error properties
    const errorMessage =
      (error.response?.data as { error?: { message?: string } })?.error?.message ||
      'Error processing request';

    console.error('Error with OpenAI API:', error.response?.data || error.message);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
