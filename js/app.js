const shorten_btn = document.querySelector(".shorten");
const shorten_result = document.querySelector("#shorten_result");

function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8);
}

async function insertRow(code, url) {
  const { data, error } = await supabaseClient.from("links").insert({
    code: code,
    original_url: url,
  });
}
async function teste() {
  const { data, error } = await supabaseClient.from("links").select("*");
  console.log(data);
  console.log("data:", data);
  console.log("error", error);
}

async function buscarLink(code) {
  const { data } = await supabaseClient
    .from("links")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  return data;
}
async function hrefLink(code) {
  const { data } = await supabaseClient
    .from("links")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  window.location.href = data.original_url;
}
async function verificarSeExiste(code) {
  const { data, error } = await supabaseClient
    .from("links")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (data) {
    console.log("O item ja existe");
    return true;
  } else {
    console.log("Item não encontrado");
    return false;
  }
}

async function fluxSearch(code) {
  const booleanSearch = await verificarSeExiste(code);
  console.log(booleanSearch);

  if (booleanSearch) {
    const response = await buscarLink(code);
    console.log(response);
  }
}
async function fluxInsert(code, url) {
  const booleanSearch = await verificarSeExiste(code);

  if (!booleanSearch) {
    await insertRow(code, url);
    console.log("Create Row Sucefull", `code: ${code}`, `url: ${url}`);
  }
}

fluxSearch("teste1");

shorten_btn.addEventListener("click", async function () {
  const code = gerarCodigo();
  const url = "www.testeFlux.com/" + code;
  await fluxInsert(code, url);

  const data_url = await buscarLink(code);
  console.log(data_url);
  shorten_result.textContent = `Codigo: ${data_url.code} \n url: ${data_url.original_url}`;
});
