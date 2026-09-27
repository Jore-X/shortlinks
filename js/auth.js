const auth_sections = document.querySelectorAll(".auth-sections");
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

signUp_form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const signUp_email = document.getElementById("signUp_email").value;
  const signUp_password = document.getElementById("signUp_password").value;
  console.log("email: ", signUp_email);
  console.log("senha: ", signUp_password);

  const { data, error } = await supabaseClient.auth.signUp({
    email: signUp_email,
    password: signUp_password,
  });

  if (error) {
    console.error("Erro ao cadastrar", error);
    return;
  }

  console.log("Usuário cadastrado", data.user);
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
    console.error("Erro ao entrar: ", error);
    return;
  }

  console.log("Login Realizado: ", data);
});
