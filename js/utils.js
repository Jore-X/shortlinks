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
    refresh_btn.click();
    input_url.value = "";
    input_url.placeholder = "Cole seu URL longo aqui...";
  } finally {
    waitingLink_bool = false;
  }
}

async function linkCopy(shortLink) {
  try {
    if (
      !shortLink ||
      !validateURL(shortLink) ||
      shortLink === `https://shortlinks-2vs.pages.dev/`
    ) {
      return erro;
    }
    await navigator.clipboard.writeText(shortLink);
    return true;
  } catch (erro) {
    alert("Falha ao copiar o link.");
    return false;
  }
}

async function copy_btns_link() {
  const code_rows = document.querySelectorAll(".code-td");
  const btns_copy_table = document.querySelectorAll(".btn-copy-table");
  btns_copy_table.forEach((btn, index) => {
    btn.addEventListener("click", async function () {
      const sucess = await linkCopy(
        `https://shortlinks-2vs.pages.dev/${code_rows[index].textContent}`,
      );

      if (sucess) {
        btn.classList.add("sucess");
        setTimeout(() => {
          btn.classList.remove("sucess");
        }, 2000);
      }
    });
  });
}

function createNewRow(table, code, original_url, clicks) {
  const newrow = document.createElement("tr");
  newrow.classList.add("table-rows");

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
  links_quantidade = Math.ceil(links.length / 10) * 10;
  changePagesCalc(pageState, lines_per_column);
  page_number.textContent = `Página ${pageState}/${Math.ceil(links_quantidade / 10)}`;

  const ordered_codes = links.toSorted((a, b) => a.code.localeCompare(b.code));
  const ordered_clicks = links.toSorted((a, b) => b.clicks - a.clicks);
  const ordered_recent = links.toSorted((a, b) => {
    const dataA = new Date(a.created_at.replace(" ", "T")).getTime();
    const dataB = new Date(b.created_at.replace(" ", "T")).getTime();

    return dataB - dataA;
  });
  increment_recents_home(ordered_recent);
  const ordered_old = links.toSorted((a, b) => {
    const dataA = new Date(a.created_at.replace(" ", "T")).getTime();
    const dataB = new Date(b.created_at.replace(" ", "T")).getTime();

    return dataA - dataB;
  });

  let total_links = 0;
  let total_clicks = 0;

  const table_fragment = document.createDocumentFragment();

  const increment_ordered_links = (ordered_Links) => {
    clearTable(0);

    if (!ordered_Links || ordered_Links == "") {
      table_fragment.appendChild(createEmptyTable(10));
      return;
    }
    table.appendChild(createEmptyTable(ordered_Links.length));

    const tbody = document.querySelector("#dashboard_table tbody");
    const links_keys = Object.keys(ordered_Links[0]);

    for (let i = 0; i < ordered_Links.length; i++) {
      for (let i = 0; i < ordered_Links.length; i++) {
        for (let j = 0; j < 3; j++) {
          const key = links_keys[j];
          tbody.rows[i].cells[j].textContent =
            `${cutText(ordered_Links[i][key], 38)}`;
          if (j === 2) {
            tbody.rows[i].cells[j + 1].innerHTML =
              `<button class="btn-copy-table">
                          <span>Copiar Link</span>
                          <span>Copiado!</span>
                      </button>`;
          }
        }
      }

      total_links++;
      total_clicks = total_clicks + ordered_Links[i].clicks;
    }
    copy_btns_link();
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

function createEmptyTable(numberRows) {
  numberRows = Math.ceil(numberRows / 10) * 10;
  const emptyTable = document.createDocumentFragment();
  for (let i = 1; i <= numberRows; i++) {
    const newrow = document.createElement("tr");
    newrow.classList.add("table-rows");

    const cellCode = document.createElement("td");
    cellCode.classList.add("code-td");

    const cellUrl = document.createElement("td");

    const cellClicks = document.createElement("td");

    const copyBtn = document.createElement("td");
    copyBtn.classList.add("cell-copy-btn");
    // copyBtn.innerHTML = `<button class="btn-copy-table">
    //                       <span>Copiar Link</span>
    //                       <span>Copiado!</span>
    //                   </button>`;

    newrow.appendChild(cellCode);
    newrow.appendChild(cellUrl);
    newrow.appendChild(cellClicks);
    newrow.appendChild(copyBtn);

    emptyTable.appendChild(newrow);
  }

  return emptyTable;
}

function clearTable(remaining_amount) {
  const tbody = document.querySelector("#dashboard_table tbody");

  for (let i = 0; i < remaining_amount; i++) {
    for (let j = 0; j < 3; j++) {
      tbody.rows[i].cells[j].textContent = ``;
    }
  }

  while (tbody.children.length > remaining_amount) {
    tbody.deleteRow(tbody.rows.length - 1);
  }
}

function changePagesCalc(page, lines_per_column) {
  const table_rows = document.querySelectorAll(".table-rows");

  let limit = lines_per_column * page;
  let start = limit - lines_per_column;

  for (let i = 0; i < table_rows.length; i++) {
    if (i < start) {
      table_rows[i].style.display = "none";
    }
    if (i >= start && i < limit) {
      table_rows[i].style.display = "";
    }
    if (i < start || i >= limit) {
      table_rows[i].style.display = "none";
    }
  }
}

function increment_recents_home(recent_links) {
  const recent_div = document.querySelector(".recent-div");
  recent_div.innerHTML = ``;
  const recent_box = document.createDocumentFragment();

  if (recent_links.length == 0 || recent_links == "" || !recent_links) {
    recent_div.innerHTML = `<div class="recent-item">
            <span class="recent-item-link">Nenhum Link Encontrado.</span>
          </div>`;
  } else {
    for (let i = 0; i < recent_links.length; i++) {
      const row = document.createElement("div");
      row.classList.add("recent-item");

      const field = document.createElement("span");
      field.classList.add("recent-item-link");
      field.textContent = `https://shortlinks-2vs.pages.dev/${recent_links[i].code}`;

      const btn_copy_field = document.createElement("button");
      btn_copy_field.classList.add("recent-btn-copy");
      btn_copy_field.dataset.index = i;

      const btn_span1 = document.createElement("span");
      const btn_span2 = document.createElement("span");

      btn_span1.textContent = "Copiar";
      btn_span2.textContent = "Copiado!";

      btn_copy_field.appendChild(btn_span1);
      btn_copy_field.appendChild(btn_span2);

      row.appendChild(field);
      row.appendChild(btn_copy_field);

      recent_box.appendChild(row);

      if (i >= 4) {
        break;
      }
    }
    recent_div.appendChild(recent_box);

    recent_div.addEventListener("click", async function (event) {
      const recent_link_ref = document.querySelectorAll(".recent-item-link");
      const button_copy = event.target.closest(".recent-btn-copy");

      if (!button_copy) return;

      const index = button_copy.dataset.index;

      const sucess = await linkCopy(recent_link_ref[index].textContent);

      if (sucess) {
        button_copy.classList.add("sucess");
        setTimeout(() => {
          button_copy.classList.remove("sucess");
        }, 2000);
      }
    });
  }
}
