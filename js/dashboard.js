// _____________________________________________________
const mobileQuery = window.matchMedia("(max-width: 768px)");
let mobile_mode;

mobileQuery.addEventListener("change", mobile_query);
// _____________________________________________________
const lines_per_column = 10;
let links_quantidade;
let pageState = 1;
// _____________________________________________________

const table = document
  .getElementById("dashboard_table")
  .getElementsByTagName("tbody")[0];
const span_links = document.getElementById("span_links");
const span_clicks = document.getElementById("span_clicks");
const refresh_btn = document.querySelector(".refresh-table");
const selectOption = document.getElementById("filter_Table");
const input_search_links = document.getElementById("input_search_links");
const newLink_btn = document.querySelector(".btn-create-new-link");

table.appendChild(createEmptyTable(10));
async function wait() {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) {
    window.location.href = "./auth.html";
    alert("Faça login para acessar o painel.")
    return;
  }
  await table_increment(table, span_links, span_clicks, selectOption.value);
  changePagesCalc(pageState, lines_per_column);
}
wait();
refresh_btn.addEventListener("click", async function () {
  clearTable(links_quantidade);
  await table_increment(table, span_links, span_clicks, selectOption.value);
  refresh_btn.classList.add("animate-on");
  setTimeout(() => {
    refresh_btn.classList.remove("animate-on");
  }, 2000);
  changePagesCalc(pageState, lines_per_column);
});
// _____________________________________________________
selectOption.addEventListener("change", async function () {
  clearTable(links_quantidade);
  await table_increment(table, span_links, span_clicks, selectOption.value);
  changePagesCalc(pageState, lines_per_column);
});

input_search_links.addEventListener("blur", function () {
  if (!document.getElementById("input_search_links").value) {
    changePagesCalc(pageState, lines_per_column);
  }
});
// _____________________________________________________
newLink_btn.addEventListener("click", function () {
  window.location.href = "./index.html";
});
// _____________________________________________________
const table_rows = document.querySelectorAll(".table-rows");
const btn_last_page = document.querySelector(".last-page");
const page_number = document.querySelector(".page-number");
const btn_next_page = document.querySelector(".next-page");

btn_last_page.addEventListener("click", function () {
  if (pageState > 1) {
    pageState--;
    changePagesCalc(pageState, lines_per_column);
    page_number.textContent = `Página ${pageState}/${Math.ceil(links_quantidade / 10)}`;
  }
});
btn_next_page.addEventListener("click", function () {
  if (pageState < links_quantidade / 10) {
    pageState++;
    changePagesCalc(pageState, lines_per_column);
    page_number.textContent = `Página ${pageState}/${Math.ceil(links_quantidade / 10)}`;
  }
});
// _____________________________________________________
