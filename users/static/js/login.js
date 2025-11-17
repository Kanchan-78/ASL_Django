const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const htmlEl = document.getElementsByTagName("html")[0];
const currentTheme = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : null;
if (currentTheme) {
  htmlEl.dataset.theme = currentTheme;
}
const toggleTheme = (theme) => {
  htmlEl.dataset.theme = theme;
  localStorage.setItem("theme", theme);
};

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#id_password");

togglePassword.addEventListener("click", function (e) {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});

// for password
const toggleReg1 = document.querySelector("#toggleReg1");
const pass1 = document.querySelector("#id_reg1");

toggleReg1.addEventListener("click", function (e) {
  const type = pass1.getAttribute("type") === "password" ? "text" : "password";
  pass1.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});

// for confirm password
const toggleReg2 = document.querySelector("#toggleReg2");
const pass2 = document.querySelector("#id_reg2");

toggleReg2.addEventListener("click", function (e) {
  const type = pass2.getAttribute("type") === "password" ? "text" : "password";
  pass2.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});