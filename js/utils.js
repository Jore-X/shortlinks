function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8);
}

async function fluxSearch(code) {
  const response = await searchLink(code);

  if (response) {
    console.log(response);
  }
}

async function fluxInsert(code, url) {
  const sucess = await insertRow(code, url);
  if (sucess) {
    console.log("Create Row Sucefull", `code: ${code}`, `url: ${url}`);
  }
  return sucess;
}

async function createLink() {
  const url = input_url.value;

  if (!validateURL(url)) {
    input_url.placeholder = "URL invalida.";
    input_url.reportValidity();

    return;
  }

  shorten_btn.disabled = true;
  shorten_btn.textContent = "Encurtando...";
  try {
    const code = gerarCodigo();
    const sucess = await fluxInsert(code, url);

    if (!sucess) {
      shorten_result.textContent = "Não foi possível criar o link.";
      return;
    }
    shorten_result.textContent = `Seu link: https://shortlinks-2vs.pages.dev/${code}`;
  } finally {
    shorten_btn.disabled = false;
    shorten_btn.textContent = "Encurtar";
  }
}
