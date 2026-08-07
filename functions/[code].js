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
