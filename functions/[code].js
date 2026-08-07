const supabaseUrl = "https://jozbcmeraswixnosofua.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvemJjbWVyYXN3aXhub3NvZnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNDYwOTcsImV4cCI6MjEwMTYyMjA5N30.D9Rapt3izdG7tiHIY0CMPUEeF1z8w8zF1EPFy9Bm3Bw";

export async function onRequest(context) {
  const code = context.params.code;

  const response = await fetch(`${supabaseUrl}/rest/v1/links?code=eq.${code}`, {
    headers: {
      apikey: supabaseKey,
      Authorizzation: `Bearer ${supabaseKey}`,
    },
  });

  const data = await response.json();

  console.log(code);
  console.log(data);
  return new Response(JSON.stringify(data));

  const link = data[0];
  console.log(link);

  //   return Response.redirect(link.original_url, 302);
}
