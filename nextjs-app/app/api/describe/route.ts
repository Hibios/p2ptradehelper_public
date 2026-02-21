import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: "sk-52ec3a09db774a7bafb80c061761f2ff",
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: Request) {
  const { code } = await req.json();
  
  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "Опиши кратко (до 2 строк) что делает этот код так, чтобы по этому описанию LLM могли понять что содержится в данном блоке кода. Отвечай только описанием." },
      { role: "user", content: code }
    ],
    temperature: 0,
  });

  return NextResponse.json({ description: response.choices[0].message.content });
}