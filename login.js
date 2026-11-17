
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// UTILIZAR A MESMA CONFIGURAÇÃO DO FIREBASE
// QUE JÁ ESTÁ NO ARQUIVO admin.js

const firebaseConfig = {
   apiKey: "AIzaSyBy_A8aU9d1Z03RKyedqEkJn6VtYICHjoQ",
  authDomain: "carteira-online-5366a.firebaseapp.com",
  projectId: "carteira-online-5366a",
  storageBucket: "carteira-online-5366a.firebasestorage.app",
  messagingSenderId: "769056199373",
  appId: "1:769056199373:web:39bef0ef4ddf13e701cf84"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function fazerLogin() {

  const usuario =
    document.getElementById("usuario").value.trim();

  const senha =
    document.getElementById("senha").value;

  if (!usuario || !senha) {
    alert("Informe o e-mail e a senha.");
    return;
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      usuario,
      senha
    );

    // Compatibilidade temporária com o painel antigo.
    // Será removida na próxima etapa.
    localStorage.setItem("adminLogado", "sim");

    window.location.href = "admin.html";

  } catch (erro) {

    console.error("Erro no login:", erro);

    if (
      erro.code === "auth/invalid-credential" ||
      erro.code === "auth/wrong-password" ||
      erro.code === "auth/user-not-found"
    ) {

      alert("E-mail ou senha incorretos.");

    } else {

      alert(
        "Não foi possível entrar.\n\n" +
        erro.message
      );

    }

  }

}

window.fazerLogin = fazerLogin;
