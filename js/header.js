fetch("/components/header.html")
  .then((response) => response.text())
  .then(async (html) => {
    document.getElementById("header").innerHTML = html;

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (user) {
      const username = document.querySelectorAll(".user-name");
      username.forEach((element) => {
        element.textContent = cutText(0, user.user_metadata.name, 12);
      });

      const usermenu = document.querySelectorAll(".usermenu, .btn-li");
      usermenu.forEach((link) => {
        link.style.display = "flex";
      });

      const logout_btns = document.querySelectorAll(".btn-logout");
      logout_btns.forEach((button) => {
        button.addEventListener("click", async () => {
          const { error } = await supabaseClient.auth.signOut();

          if (error) {
            console.error("Erro ao sair: ", error);
            return;
          }

          window.location.href = "/";
        });
      });

      loggedIn = true;

    } else {
      const login_links = document.querySelectorAll(".href-login");
      login_links.forEach((link) => {
        link.style.display = "flex";
      });

      loggedIn = false;
      
    }

    const mobile_menu_btn = document.querySelector(".mobile-menu-btn");
    const mobile_menu_btn_icon = document.querySelector(".mobile-menu-btn > i");

    const mobile_menu = document.querySelector(".mobile-menu");
    mobile_menu_btn.addEventListener("click", function () {
      mobile_menu_btn_icon.classList.toggle("fa-bars");
      mobile_menu_btn_icon.classList.toggle("fa-x");
      mobile_menu.classList.toggle("active");
    });
    document.dispatchEvent(new Event("headerLoaded"));
  });
