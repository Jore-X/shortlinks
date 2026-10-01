document.addEventListener("headerLoaded", () => {
  const signinLogin_href = document.querySelectorAll(".href-login");

  for (let i = 0; i < signinLogin_href.length; i++) {
    signinLogin_href[i].style.display = "none";
  }
});
// _________________________________________________________________
const auth_sections = document.querySelectorAll(".auth-container");
const signUp_acc_link = document.querySelector(".signUp-acc-link");
const login_acc_link = document.querySelector(".login-acc-link");

signUp_acc_link.addEventListener("click", () => {
  auth_sections[0].classList.remove("active");
  auth_sections[1].classList.add("active");
});
login_acc_link.addEventListener("click", () => {
  auth_sections[1].classList.remove("active");
  auth_sections[0].classList.add("active");
});

function passwordValidate() {
  const password = document.getElementById("signUp_password");
  const confirm_password = document.getElementById("signUp_confirm_password");

  if (password.value === confirm_password.value) {
    confirm_password.setCustomValidity("");
  } else {
    confirm_password.setCustomValidity("As senhas não conferem.");
  }
}

//__________________________________________
//AUTENTICAÇÃO
async function teste() {
  const { data, error } = await supabaseClient.auth.getSession();
  console.log("Sessão atual: ", data.session);
}
teste();

const login_form = document.getElementById("login_form");
const signUp_form = document.getElementById("signUp_form");
const login_message = document.getElementById("login_message");
const signUp_message = document.getElementById("signUp_message");
const resendConfimation_box = document.getElementById(
  "resend_confirmation_box",
);
const resendConfimation_btn = document.getElementById("resend_confirmation");

login_form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const login_email = document.getElementById("login_email").value;
  const login_password = document.getElementById("login_password").value;
  console.log("email: ", login_email);

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: login_email,
    password: login_password,
  });

  if (error) {
    if (error.message === "Email not confirmed") {
      login_message.textContent = "Confirme seu e-mail antes de entrar.";
      login_message.style.color = "var(--red-muted)";
      resendConfimation_box.style.display = "flex";
    } else {
      login_message.textContent = "E-mail ou senha incorretos.";
      resendConfimation_box.style.display = "none";
    }
    console.error("Erro ao entrar: ", error);
    return;
  }

  resendConfimation_box.style.display = "none";
  login_message.textContent = "Login Realizado!";
  login_message.style.color = "green";

  console.log("Login Realizado!");
  window.location.href = "./index.html";
});

signUp_form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const signUp_name = document.getElementById("signUp_name").value;
  const signUp_email = document.getElementById("signUp_email").value;
  const signUp_password = document.getElementById("signUp_password").value;
  const { data, error } = await supabaseClient.auth.signUp({
    email: signUp_email,
    password: signUp_password,
    options: {
      data: {
        name: signUp_name,
      },
    },
  });

  if (error) {
    signUp_message.textContent = error.message;
    console.error("Erro ao cadastrar", error);
    return;
  }
  if (data.user && data.user.identities.length === 0) {
    signUp_message.textContent = "Este e-mail já está cadastrado.";
    return;
  }

  if (data.user && !data.session) {
    signUp_message.textContent =
      "Verifique seu e-mail para confirmar o cadastro.";
    signUp_message.style.color = "green";
    login_message.textContent = `Confirme o email na sua caixa de entrada.`;
    login_message.style.whiteSpace = "pre-line";

    document.getElementById("login_email").value = signUp_email;
    document.getElementById("login_password").value = signUp_password;

    setTimeout(() => {
      login_acc_link.click();
    }, 5000);
    return;
  }
});

resendConfimation_btn.addEventListener("click", async () => {
  const email = document.getElementById("login_email").value;

  const { error } = await supabaseClient.auth.resend({
    type: "signup",
    email: email,
  });

  if (error) {
    console.error("Erro ao reenviar confirmação: ", error);
    login_message.textContent = "Não foi possível reenviar o e-mail. Aguarde.";
    return;
  }

  login_message.textContent = "E-mail de confirmação reenviado!";
  login_message.style.color = "green";

  resendConfimation_btn.disabled = true;
  resendConfimation_btn.classList.add("disabled");

  let cooldown = 60;
  resendConfimation_btn.textContent = `Reenviar (${cooldown}s)`;

  const interval = setInterval(() => {
    cooldown--;

    resendConfimation_btn.textContent = `Reenviar (${cooldown}s)`;

    if (cooldown <= 0) {
      clearInterval(interval);

      resendConfimation_btn.disabled = false;
      resendConfimation_btn.classList.remove("disabled");
      resendConfimation_btn.textContent = "Reenviar confirmação";
    }
  }, 1000);
});
