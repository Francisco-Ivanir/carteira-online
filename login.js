function fazerLogin() {

const usuario =
document.getElementById("usuario").value.trim();

const senha =
document.getElementById("senha").value.trim();

alert(
"Usuario=" + usuario +
"\nSenha=" + senha
);

if (
usuario === "admin" &&
senha === "123456"
) {

```
alert("PASSOU NO IF");

localStorage.setItem(
  "adminLogado",
  "sim"
);

alert(
  "Valor salvo: " +
  localStorage.getItem("adminLogado")
);

window.location.href =
  "admin.html";
```

} else {

```
alert("Usuário ou senha inválidos.");
```

}

}

window.fazerLogin = fazerLogin;
