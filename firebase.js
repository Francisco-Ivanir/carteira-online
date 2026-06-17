import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

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

const db = getFirestore(app);

async function testarFirestore() {

  try {

    const docRef = doc(
      db,
      "clientes",
      "cliente-teste"
    );

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const dados = docSnap.data();

    document.getElementById("nome").innerText =
  dados.nome;

document.getElementById("emprestado").innerText =
  "R$ " + dados.emprestado.toLocaleString("pt-BR");

document.getElementById("pago").innerText =
  "R$ " + dados.pago.toLocaleString("pt-BR");

document.getElementById("saldo").innerText =
  "R$ " + dados.saldo.toLocaleString("pt-BR");

const percentual =
  (dados.pago / dados.emprestado) * 100;

document.getElementById("percentual").innerText =
  percentual.toFixed(0);

document.getElementById("barra").style.width =
  percentual + "%";

alert("Dados carregados do Firebase!");

      console.log(dados);

    } else {

      alert("Documento cliente-teste não encontrado.");

    }

  } catch (erro) {

    console.error(erro);

    alert(
      "Erro ao conectar ao Firestore.\n\n" +
      erro.message
    );

  }

}

testarFirestore();
