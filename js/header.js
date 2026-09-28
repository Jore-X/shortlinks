fetch("/components/header.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("header").innerHTML = html;
    
    const mobile_menu_btn = document.querySelector(".mobile-menu-btn");
    const mobile_menu_btn_icon = document.querySelector(".mobile-menu-btn > i");

    const mobile_menu = document.querySelector(".mobile-menu");
    mobile_menu_btn.addEventListener("click", function () {
      mobile_menu_btn_icon.classList.toggle("fa-bars");
      mobile_menu_btn_icon.classList.toggle("fa-x");
      mobile_menu.classList.toggle("active");
    });
  });
