const supabaseUrl = "https://jozbcmeraswixnosofua.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvemJjbWVyYXN3aXhub3NvZnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNDYwOTcsImV4cCI6MjEwMTYyMjA5N30.D9Rapt3izdG7tiHIY0CMPUEeF1z8w8zF1EPFy9Bm3Bw";
const supabaseClient = supabase.createClient(supabaseUrl, SUPABASE_ANON_KEY);

async function searchLink(code) {
  const { data } = await supabaseClient
    .from("links")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  return data;
}

async function insertRow(code, url) {
  const { data, error } = await supabaseClient.from("links").insert({
    code: code,
    original_url: url,
  });
}