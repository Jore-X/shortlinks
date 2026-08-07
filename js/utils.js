function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8);
}

async function fluxSearch(code) {
  const booleanSearch = await search_if_exist(code);
  console.log(booleanSearch);

  if (booleanSearch) {
    const response = await searchLink(code);
    console.log(response);
  }
}

async function fluxInsert(code, url) {
  const booleanSearch = await search_if_exist(code);

  if (!booleanSearch) {
    await insertRow(code, url);
    console.log("Create Row Sucefull", `code: ${code}`, `url: ${url}`);
  }
}

async function createLink() {
  const url = input_url.value;
  if (validateURL(url)) {
    const code = gerarCodigo();
    await fluxInsert(code, url);

    shorten_result.textContent = `Seu link: https://shortlinks-2vs.pages.dev/${code}`;
  } else {
    input_url.placeholder = "URL invalida.";
    input_url.reportValidity();
  }
}
