function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8);
}

function cutText(text, limit) {
  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  }
  return text;
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
    input_url.placeholder = "Cole seu URL longo aqui...";
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

function createNewRow(table, code, original_url, clicks) {
  const newrow = document.createElement("tr");

  const cellCode = document.createElement("td");
  cellCode.textContent = code;

  const cellUrl = document.createElement("td");
  cellUrl.textContent = cutText(original_url, 38);

  const cellClicks = document.createElement("td");
  cellClicks.textContent = clicks;

  const copyBtn = document.createElement("td");
  copyBtn.innerHTML = `<button>
                          <span>Copiar Link</span>
                      </button>`;

  newrow.appendChild(cellCode);
  newrow.appendChild(cellUrl);
  newrow.appendChild(cellClicks);
  newrow.appendChild(copyBtn);

  return newrow;
}

async function table_increment(table, panel_links, panel_clicks) {
  const response = await fetch("/stats");
  const links = await response.json();

  const links_ordenados = links.toSorted((a, b) => b.clicks - a.clicks);

  let total_links = 0;
  let total_clicks = 0;

  const table_fragment = document.createDocumentFragment();

  for (let i = 0; i < links_ordenados.length; i++) {
    table_fragment.appendChild(
      createNewRow(
        table,
        links_ordenados[i].code,
        links_ordenados[i].original_url,
        links_ordenados[i].clicks,
      ),
    );

    total_links++;
    total_clicks = total_clicks + links_ordenados[i].clicks;
  }

  table.appendChild(table_fragment);

  panel_links.textContent = `${total_links}`;
  panel_clicks.textContent = `${total_clicks}`;
}
