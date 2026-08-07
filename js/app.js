const shorten_btn = document.querySelector(".shorten");
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