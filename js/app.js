const shorten_btn = document.querySelector(".shorten-btn");
const shorten_result = document.querySelector("#shorten_result");
const input_url = document.getElementById("original_url_input");

input_url.addEventListener("input", () => {
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
const table = document
  .getElementById("dashboard_table")
  .getElementsByTagName("tbody")[0];
const span_links = document.getElementById("span_links");
const span_clicks = document.getElementById("span_clicks");
const refresh_btn = document.querySelector(".refresh-table");
table_increment(table, span_links, span_clicks);
refresh_btn.addEventListener("click", () => {
  table.innerHTML = "";
  table_increment(table, span_links, span_clicks);
  refresh_btn.classList.add("animate-on");
  setTimeout(() => {
    refresh_btn.classList.remove("animate-on");
  }, 2000);
});
