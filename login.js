alert("LOGIN JS VERSAO NOVA");

function fazerLogin() {

const usuario =
document.getElementById("usuario")
.value
.trim();

const senha =
document.getElementById("senha")
.value
.trim();

if (
usuario == "admin" &&
senha == "123456"
) {

```
alert("LOGIN OK");

localStorage.setItem(
  "adminLogado",
  "sim"
);

location.href = "admin.html";
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
