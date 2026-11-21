
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

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
const db = getFirestore(app);

const UID_ADMINISTRADOR =
  "p5VKHfDsmWaowPo3d0be5OVtW8B3";

async function fazerLogin() {

  const usuario =
    document.getElementById("usuario").value.trim();

  const senha =
    document.getElementById("senha").value;

  if (!usuario || !senha) {
    alert("Informe o e-mail e a senha.");
    return;
  }

  let usuarioAutenticado;

  try {

    const resultado = await signInWithEmailAndPassword(
      auth,
      usuario,
      senha
    );

    usuarioAutenticado = resultado.user;

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

    return;
  }

  // ACESSO DO ADMINISTRADOR

  if (usuarioAutenticado.uid === UID_ADMINISTRADOR) {

    window.location.replace("admin.html");
    return;
  }

  // ACESSO DO CLIENTE

  const params = new URLSearchParams(
    window.location.search
  );

  const codigoCliente = params.get("cliente");

  if (!codigoCliente) {

    await signOut(auth);

    alert(
      "Para acessar sua carteira, abra primeiro o link enviado pelo administrador."
    );

    return;
  }

  try {

    const clienteRef = doc(
      db,
      "clientes",
      codigoCliente
    );

    const clienteSnap = await getDoc(clienteRef);

    if (!clienteSnap.exists()) {

      await signOut(auth);

      alert("Cadastro do cliente não encontrado.");
      return;
    }

    const dadosCliente = clienteSnap.data();

    if (
      dadosCliente.authUid !== usuarioAutenticado.uid
    ) {

      await signOut(auth);

      alert(
        "Esta conta não está vinculada a este cadastro."
      );

      return;
    }

    window.location.replace(
      "index.html?cliente=" +
      encodeURIComponent(codigoCliente)
    );

  } catch (erro) {

    console.error("Erro ao validar cliente:", erro);

    await signOut(auth);

    alert(
      "Não foi possível validar seu acesso.\n\n" +
      erro.message
    );
  }
}

window.fazerLogin = fazerLogin;
