import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jozbcmeraswixnosofua.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvemJjbWVyYXN3aXhub3NvZnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNDYwOTcsImV4cCI6MjEwMTYyMjA5N30.D9Rapt3izdG7tiHIY0CMPUEeF1z8w8zF1EPFy9Bm3Bw";
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export async function onRequest(context) {
  const code = context.params.code;
  const { data } = await supabaseClient
    .from("links")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  console.log(code);
  return Response.redirect(data.original_url, 302);
}
