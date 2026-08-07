export async function onRequest(context) {
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_ANON_KEY;
  const code = context.params.code;

  const response = await fetch(`${supabaseUrl}/rest/v1/links?code=eq.${code}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  const data = await response.json();

  console.log(code);
  console.log(data);
  //   return new Response(JSON.stringify(data));

  const link = data[0];
  if (!link) {
    return new Response("Link não encontrado", {
      status: 404,
    });
  }

  return Response.redirect(link.original_url, 302);
}
