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
  const shortingState = ["Encurtando.", "Encurtando..", "Encurtando..."];
  let i = 0;
  let shortingAnimate_bool = true;
  const shortingAnimate = setInterval(() => {
    shorten_btn.textContent = shortingState[i];
    i++;
    if (i >= shortingState.length) {
      i = 0;
    }

    if (shortingAnimate_bool === false) {
      clearInterval(shortingAnimate);
      shorten_btn.textContent = "Encurtar";
    }
  }, 500);
  shorten_btn.disabled = true;
  shorten_btn.classList.add("disabled");
  try {
    const code = gerarCodigo();
    const sucess = await fluxInsert(code, url);

    if (!sucess) {
      shorten_result.textContent = "Não foi possível criar o link.";
      return;
    }
    shorten_result.textContent = `https://shortlinks-2vs.pages.dev/${code}`;
  } finally {
    shorten_btn.disabled = false;
    shorten_btn.classList.remove("disabled");
    shortingAnimate_bool = false;
  }
}

async function linkCopy(shortLink) {
  try {
    if (!shortLink) {
      return erro;
    }
    await navigator.clipboard.writeText(shortLink);
    return true;
  } catch (erro) {
    alert("Falha ao copiar o link.");
    return false;
  }
}
