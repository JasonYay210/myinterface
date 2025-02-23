import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    // Get the raw user input from the request body
    const userRequest = await request.text(); // Raw text input from user

    // Validate input
    if (!userRequest.trim()) {
      return NextResponse.json(
        { error: 'No input provided. Please specify what code you need.' },
        { status: 400 }
      );
    }

    // Construct the system message dynamically based on user input
    const systemMessage = `REPLY with Generate Componenet (dont say sure, dont say anything just generate) Code ONLY. Create the entire div element. HTML and CSS ONLY. CSS font fam is arial. Create all styling with INDUSTRY STANDARD(standard padding,gaps,sizing)`;

    // Use Groq AI to generate the requested code
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: userRequest, // Directly use the raw user input
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      max_tokens: 1500, // Adjust max tokens to accommodate the code component
    });

    return NextResponse.json({
      result: completion.choices[0].message.content, // The generated code for the requested component
    });

  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: `Error processing the input: ${error.message}` },
      { status: 500 }
    );
  }
}
