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

  if (!response.ok) {
    return new Response("Erro ao buscar estatísticas", {
      status: 500,
    });
  }

  const data = await response.json();
  const link = data[0];

  if (!link) {
    return new Response("Link não encontrado", {
      status: 404,
    });
  }

  return Response.json({
    code: link.code,
    original_url: link.original_url,
    clicks: link.clicks,
  });
}
