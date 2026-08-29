const homepage = document.getElementById("homepage");
const href_homepage = document.querySelector(".href-homepage");
const dashboard = document.getElementById("dashboard");
const href_dashboard = document.querySelector(".href-dashboard");

href_homepage.addEventListener("click", () => {
  homepage.classList.add("show");
  dashboard.classList.remove("show");
});
href_dashboard.addEventListener("click", () => {
  dashboard.classList.add("show");
  homepage.classList.remove("show");
});

// _____________________________________________________

const shorten_btn = document.querySelector(".shorten-btn");
const shorten_result = document.querySelector("#shorten_result");
const input_url = document.getElementById("original_url_input");

input_url.addEventListener("input", function () {
  if (!input_url.reportValidity()) {
    input_url.style.borderColor = "red";
  } else {
    input_url.style.borderColor = "";
  }
});

shorten_btn.addEventListener("click", createLink);

// __________________________________________________
const copy_btn = document.querySelector(".copy-btn");

copy_btn.addEventListener("click", async function () {
  const sucess = await linkCopy(shorten_result.textContent);
  console.log(sucess);
  if (sucess) {
    copy_btn.classList.add("sucess");
    setTimeout(() => {
      copy_btn.classList.remove("sucess");
    }, 2000);
  }
});

input_url.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    shorten_btn.click();
  }
});

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
  href_homepage.click();
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