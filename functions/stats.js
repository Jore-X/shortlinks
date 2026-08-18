export async function onRequest(context) {
  const supabaseUrl = context.env.SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_ANON_KEY;
  const code = context.params.code;

  const response = await fetch(`${supabaseUrl}/rest/v1/links?select=code,original_url,clicks,created_at`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    return new Response("Erro ao buscar estatísticas", {
      status: 500,
    });
  }

  const data = await response.json();

  return Response.json(data);
}
