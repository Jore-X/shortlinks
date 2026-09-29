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

signUp_form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const signUp_name = document.getElementById("signUp_name").value;
  const signUp_email = document.getElementById("signUp_email").value;
  const signUp_password = document.getElementById("signUp_password").value;
  console.log("name: ", signUp_name);
  console.log("email: ", signUp_email);
  console.log("senha: ", signUp_password);

  const { data, error } = await supabaseClient.auth.signUp({
    email: signUp_email,
    password: signUp_password,
    options: {
      data: {
        name: signUp_name,
      },
    },
  });

  console.log("Usuário retornado:", data.user);
  console.log("Metadata:", data.user?.user_metadata);

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
      "Cadastro realizado! Confirme seu e-mail para continuar.";
    signUp_message.style.color = "green";
    login_message.textContent = `Confirme o email na sua caixa de entrada.\n Só depois efetue o login.`;
    login_message.style.whiteSpace = "pre-line";

    setTimeout(() => {
      login_acc_link.click();
    }, 5000);
    return;
  }
});

login_form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const login_email = document.getElementById("login_email").value;
  const login_password = document.getElementById("login_password").value;
  console.log("email: ", login_email);
  console.log("senha: ", login_password);

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: login_email,
    password: login_password,
  });

  if (error) {
    login_message.textContent = "E-mail ou senha incorretos.";
    console.error("Erro ao entrar: ", error);
    return;
  }
  login_message.textContent = "Login Realizado!";
  login_message.style.color = "green";

  console.log("Login Realizado!");
  window.location.href = "./index.html";
});
