import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseadmin } from "@/lib/supabaseAdmin";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, org_name } = body as { message: string; org_name: string };

    if (!message || !org_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch the organization's opportunities
    const { data: orgOpps, error: orgError } = await supabaseadmin
    .from("opportunities")
    .select(`
        id,
        title,
        category,
        date,
        hours,
        featured,
        user_applications!user_applications_opportunity_id_fkey (
        status,
        applied_at,
        user:user_id (
            id,
            name
        )
        )
    `)
    .eq("organization", org_name);

    if (orgError) throw orgError;

    const contextSummary =
      orgOpps?.map((opp: any) => {
        const apps = opp.user_applications || [];
        return `Opportunity: ${opp.title}, Category: ${opp.category}, Date: ${opp.date}, Hours: ${opp.hours}, Featured: ${opp.featured}, Applicants: ${apps.length}`;
      }).join("\n") || "No opportunities found.";

    // Build prompt for the chatbot
    const prompt = `
You are an assistant for organizations using the Bridge volunteering app.

Here is the current context for organization ${org_name}:

${contextSummary}

Answer the organization's questions based on this context. Focus on:
- Summarizing existing opportunities
- Suggestions for promoting opportunities outside of Bridge
- How to attract more volunteers

If the question is unrelated, answer politely but do not invent data.
do not format your answers with Markdown language (etc like **, etc.).
keep responses concise and relevant, and only generate longer answers when necessary.

Organization asks: "${message}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message?.content?.trim() ?? "I'm not sure how to respond.";

    return NextResponse.json({ response: responseText });
  } catch (err: any) {
    console.error("Org Chat API Error:", err.message || err);
    return NextResponse.json({ response: "Sorry, something went wrong." }, { status: 500 });
  }
}
