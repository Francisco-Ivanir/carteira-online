function fazerLogin() {

const usuario =
document.getElementById("usuario")
.value
.trim();

const senha =
document.getElementById("senha")
.value
.trim();

  alert(
  "Usuario=[" + usuario +
  "] Senha=[" + senha + "]"
);
  
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
