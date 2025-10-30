import OpenAI from "openai";
import { NextResponse } from "next/server";


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { userName, opportunity, hours } = await req.json();

  const prompt = `Write a short, enthusiastic thank-you note for ${userName} who volunteered ${hours} hours at ${opportunity}.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({ note: completion.choices[0].message?.content || "" });
}
