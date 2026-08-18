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

async function table_increment(table, panel_links, panel_clicks, selectOption) {
  const response = await fetch("/stats");
  const links = await response.json();

  const ordered_codes = links.toSorted((a, b) => a.code.localeCompare(b.code));
  const ordered_clicks = links.toSorted((a, b) => b.clicks - a.clicks);
  const ordered_recent = links.toSorted((a, b) => {
    const dataA = new Date(a.created_at.replace(" ", "T")).getTime();
    const dataB = new Date(b.created_at.replace(" ", "T")).getTime();

    return dataB - dataA;
  });
  const ordered_old = links.toSorted((a, b) => {
    const dataA = new Date(a.created_at.replace(" ", "T")).getTime();
    const dataB = new Date(b.created_at.replace(" ", "T")).getTime();

    return dataA - dataB;
  });

  let total_links = 0;
  let total_clicks = 0;

  const table_fragment = document.createDocumentFragment();

  const increment_ordered_links = (ordered_Links) => {
    for (let i = 0; i < ordered_Links.length; i++) {
      table_fragment.appendChild(
        createNewRow(
          table,
          ordered_Links[i].code,
          ordered_Links[i].original_url,
          ordered_Links[i].clicks,
        ),
      );

      total_links++;
      total_clicks = total_clicks + ordered_Links[i].clicks;
    }
  };

  if (selectOption == "clicks") {
    increment_ordered_links(ordered_clicks);
  } else if (selectOption == "codes") {
    increment_ordered_links(ordered_codes);
  } else if (selectOption == "recent") {
    increment_ordered_links(ordered_recent);
  } else if (selectOption == "old") {
    increment_ordered_links(ordered_old);
  }

  table.appendChild(table_fragment);

  panel_links.textContent = `${total_links}`;
  panel_clicks.textContent = `${total_clicks}`;
}

function filterTable() {
  const input = document
    .getElementById("input_search_links")
    .value.toLowerCase();

  const rows = document
    .querySelector("#dashboard_table tbody")
    .getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const text = rows[i].textContent || rows[i].innerText;
    if (text.toLowerCase().indexOf(input) > -1) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}
