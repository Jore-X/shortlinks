function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8);
}

async function regressiveCount(count) {
  while (count >= 0) {
    shorten_btn.textContent = `${count}`;
    count--;
    await new Promise((r) => setTimeout(r, 1000));
  }
  shorten_btn.textContent = "Encurtar";
  shorten_btn.disabled = false;
  shorten_btn.classList.remove("disabled");
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
  shorten_result.textContent = "";
  
  const url = input_url.value;

  if (!validateURL(url)) {
    input_url.placeholder = "URL invalida.";
    input_url.style.borderColor = "red";
    input_url.reportValidity();

    return;
  }
  let i = 0;
  let waitingLink_bool = true;
  const waitingLink = setInterval(() => {
    shorten_btn.innerHTML = `<i class="fa-solid fa-circle-notch"></i>`;

    if (waitingLink_bool === false) {
      clearInterval(waitingLink);
      regressiveCount(5);
    }
  }, 500);
  shorten_btn.disabled = true;
  shorten_btn.classList.add("disabled");
  try {
    const code = gerarCodigo();
    const sucess = await fluxInsert(code, url);

    if (!sucess) {
      shorten_result.textContent =
        "Não foi possível criar o link, verifique e tente novamente.";
      copy_btn.classList.add("disable");
      copy_btn.disabled = true;
      return;
    }
    copy_btn.classList.remove("disable");
    copy_btn.disabled = false;

    shorten_result.textContent = `https://shortlinks-2vs.pages.dev/${code}`;
    input_url.value = "";
  } finally {
    waitingLink_bool = false;
  }
}

async function linkCopy(shortLink) {
  try {
    if (!shortLink || !validateURL(shortLink)) {
      return erro;
    }
    await navigator.clipboard.writeText(shortLink);
    return true;
  } catch (erro) {
    alert("Falha ao copiar o link.");
    return false;
  }
}
