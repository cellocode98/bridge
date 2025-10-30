import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { categories, pastHours } = await req.json();

  const prompt = `
  Suggest 3 volunteer opportunities for a user who likes ${categories.join(
    ", "
  )} and has completed ${pastHours} volunteer hours recently.
  Return only a JSON array with fields: title, organization, date.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const text = completion.choices[0].message?.content || "[]";
  let data;
  try { data = JSON.parse(text); } catch { data = []; }

  return NextResponse.json(data);
}
