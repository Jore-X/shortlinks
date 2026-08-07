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

  //   return new Response(JSON.stringify(data));

  const link = data[0];
  if (!link) {
    return new Response("Link não encontrado", {
      status: 404,
    });
  }
  console.log(code);
  const rpcResponse = await fetch(
    `${supabaseUrl}/rest/v1/rpc/increment_clicks`,
    {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link_code: code,
      }),
    },
  );
  if (!rpcResponse.ok) {
    console.error(await rpcResponse.text());
  }
  console.log("RPC STATUS:", rpcResponse.status);
  const rpcBody = await rpcResponse.text();

  console.log("RPC BODY:", rpcBody);

  return Response.redirect(link.original_url, 302);
}
