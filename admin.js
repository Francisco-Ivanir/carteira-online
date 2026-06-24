import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  orderBy
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

if (
  localStorage.getItem(
    "adminLogado"
  ) !== "sim"
) {

  window.location.href =
    "login.html";

}

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

async function carregarClientes() {

  const lista =
    document.getElementById("listaClientes");

  lista.innerHTML = "";

  const clientesRef =
    collection(db, "clientes");

  const clientesSnap =
    await getDocs(clientesRef);

  clientesSnap.forEach((cliente) => {

    const dados =
      cliente.data();

    const div =
      document.createElement("div");

    div.style.marginBottom = "10px";

    const link =
  "https://francisco-ivanir.github.io/carteira-online/?cliente=" +
  cliente.id;

div.innerHTML =
  "<strong>" +
  cliente.id +
  "</strong> - " +
  dados.nome +

  "<br>" +

  "Emprestado: R$ " +
  dados.emprestado.toLocaleString("pt-BR") +

  "<br>" +

  "Pago: R$ " +
  dados.pago.toLocaleString("pt-BR") +

  "<br>" +

  "Saldo: R$ " +
  dados.saldo.toLocaleString("pt-BR") +

  "<br><br>" +

  "<button onclick=\"window.open('" +
link +
"','_blank')\">Abrir</button> " +

"<button onclick=\"navigator.clipboard.writeText('" +
link +
"')\">Copiar Link</button>" +

" <button onclick=\"editarCliente('" +
cliente.id +
"')\">Editar</button>";
    
    lista.appendChild(div);

  });
function sair() {

  localStorage.removeItem(
    "adminLogado"
  );

  window.location.href =
    "login.html";

}

window.sair = sair;
}
async function editarCliente(codigo) {

  try {

    const docRef =
      doc(db, "clientes", codigo);

    const docSnap =
      await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Cliente não encontrado.");
      return;
    }

    const dados =
      docSnap.data();

    const novoNome =
      prompt(
        "Nome do cliente:",
        dados.nome
      );

    if (!novoNome) return;

    const adicionalTexto =
      prompt(
        "Valor adicional emprestado:",
        "0"
      );

    if (adicionalTexto === null) return;

    const adicional =
      Number(
        adicionalTexto.replace(",", ".")
      );

    if (isNaN(adicional)) {
      alert("Valor inválido.");
      return;
    }

    await updateDoc(docRef, {

      nome: novoNome,

      emprestado:
        dados.emprestado + adicional,

      saldo:
        dados.saldo + adicional

    });

    alert("Cliente atualizado!");

    location.reload();

  } catch (erro) {

    alert(
      "Erro:\n\n" +
      erro.message
    );

  }

}

window.editarCliente =
  editarCliente;
carregarClientes();
