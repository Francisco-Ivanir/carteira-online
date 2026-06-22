function fazerLogin() {

  alert("Botão clicado");

const usuario =
document.getElementById("usuario").value;

const senha =
document.getElementById("senha").value;

if (
usuario === "admin" &&
senha === "123456"
) {

```
localStorage.setItem(
  "adminLogado",
  "sim"
);

window.location.href =
  "admin.html";
```

} else {

```
alert(
  "Usuário ou senha inválidos."
);
```

}

}

window.fazerLogin =
fazerLogin;
