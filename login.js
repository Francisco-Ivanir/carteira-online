function fazerLogin() {

  alert("Entrou na função");

  localStorage.setItem(
    "adminLogado",
    "sim"
  );

  window.location.href =
    "admin.html";

}

window.fazerLogin =
  fazerLogin;
