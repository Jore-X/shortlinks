export function onRequest(context) {
  async function hrefLink(code) {
    const { data } = await supabaseClient
      .from("links")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    return new Response.redirect(data.original_url);
  }
  console.log(context.params.code);
  hrefLink(context.params.code);
}
