// app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseadmin } from "@/lib/supabaseAdmin";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId, type } = body as {
      message: string;
      userId: string;
      type: "user" | "organization";
    };

    if (!message || !userId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let contextSummary = "";

    if (type === "user") {
      const { data: apps, error } = await supabaseadmin
              .from("user_applications")
              .select(`
                status,
                applied_at,
                opportunity:opportunity_id (
                  id,
                  title,
                  organization,
                  category,
                  date,
                  hours,
                  proofs:fk_proofs_opportunity (id, image_url, note, verified, created_at)
                )
              `)
              .eq("user_id", userId);

console.log("Flat apps:", apps, "Error:", error);

            console.log(apps);
            console.log("UserId:", userId);
console.log("Fetched apps:", apps);
console.log("Supabase error:", error);

      if (error) throw error;
      contextSummary =
        apps
          ?.map((app: any) => {
            const opp = app.opportunity;
            const verifiedProofs = (opp?.proofs || []).filter((p: any) => p.verified);
            return `Opportunity: ${opp?.title}, Organization: ${opp?.organization}, Category: ${opp?.category}, Date: ${opp?.date}, Hours: ${opp?.hours}, Featured: ${opp?.featured}, Status: ${app.status}, Verified proofs: ${verifiedProofs.length}`;
          })
          .join("\n") || "No opportunities found.";
    } else if (type === "organization") {
      const { data: orgOpps, error: orgError } = await supabaseadmin
        .from("opportunities")
        .select(`
          id,
          title,
          category,
          date,
          hours,
          featured,
          user_applications:user_applications!user_applications_opportunity_id (
            status,
            applied_at,
            user:user_id (id, name)
          )
        `)
        .eq("organization_id", userId);
        
      if (orgError) throw orgError;

      contextSummary =
        orgOpps
          ?.map((opp: any) => {
            const apps = opp.user_applications || [];
            return `Opportunity: ${opp.title}, Category: ${opp.category}, Date: ${opp.date}, Hours: ${opp.hours}, Featured: ${opp.featured}, Applicants: ${apps.length}`;
          })
          .join("\n") || "No opportunities found.";
    }

    const prompt = `
You are a helpful assistant for the Bridge volunteering app.
Here is the context based on the type "${type}":

${contextSummary}

Answer the user's question based on this context.
If the user asks something unrelated, answer politely but do not invent data. Do not format your answers with markdown.
Also, an opportunity is considered "pending" if the date of the opportunity is currently now or in the past. 
You don't need to say the entire entry of an opportunity or application, just summarize the key details relevant to the user's question.
User: "${message}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const responseText = completion.choices[0].message?.content?.trim() ?? "I'm not sure how to respond.";
    console.log(contextSummary);
    return NextResponse.json({ response: responseText });
  } catch (err: any) {
    console.error("Chat API Error:", err.message || err);
    return NextResponse.json({ response: "Sorry, something went wrong." }, { status: 500 });
  }
}
