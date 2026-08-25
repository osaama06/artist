import { createClient } from "@/lib/supabase/server";

// Supabase's free tier pauses a project after ~7 days with no API activity.
// Vercel Cron (see vercel.json — runs daily, free on the Hobby plan) hits
// this route so the project is never actually idle long enough to pause.
// Protected with CRON_SECRET so only Vercel's own scheduler (which sends
// this header automatically) can trigger it.
export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").select("id").limit(1);

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, pingedAt: new Date().toISOString() });
}
