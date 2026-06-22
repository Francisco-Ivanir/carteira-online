import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc
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
const db = getFirestore(app);

async function criarCliente() {

  try {

    const nome =
      document.getElementById("nome").value;

    const emprestado =
      Number(
        document.getElementById("emprestado").value
      );

    if (!nome) {
      alert("Informe o nome.");
      return;
    }

    const clientesRef =
      collection(db, "clientes");

    const clientesSnap =
      await getDocs(clientesRef);

    const proximoNumero =
      clientesSnap.size + 1;

    const codigo =
      "CLI" +
      String(proximoNumero)
        .padStart(3, "0");

    await setDoc(
      doc(db, "clientes", codigo),
      {
        nome: nome,
        emprestado: emprestado,
        pago: 0,
        saldo: emprestado
      }
    );

    const linkCliente =
  "https://francisco-ivanir.github.io/carteira-online/?cliente=" +
  codigo;

alert(
  "Cliente criado: " +
  codigo +
  "\n\nLink:\n" +
  linkCliente
);

  } catch (erro) {

    alert(
      "Erro:\n\n" +
      erro.message
    );

  }

}

window.criarCliente =
  criarCliente;
