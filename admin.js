// CARTEIRA ONLINE
// VERSÃO 1.1 ESTÁVEL
//
// Login OK
// Pesquisa OK
// Editar OK
// Excluir OK
// Pagamento via Admin OK
// Atualização de saldo automática OK
//
// Backup criado em 02/07/2026

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
addDoc,
doc,
setDoc,
getDoc,
updateDoc,
deleteDoc,
query,
orderBy,
limit
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
  formatarMoeda
} from "./utils.js";

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

  let totalEmprestado = 0;
let totalPago = 0;
let totalSaldo = 0;
  
  clientesSnap.forEach((cliente) => {

   const dados =
  cliente.data();
    
totalEmprestado +=
  dados.emprestado;

totalPago +=
  dados.pago;

totalSaldo +=
  dados.saldo;
    
const div =
  document.createElement("div");

div.className = "cliente";
div.dataset.busca =
(
  cliente.id +
  " " +
  dados.nome
).toLowerCase();
    
div.style.background = "#ffffff";
div.style.padding = "15px";
div.style.marginBottom = "15px";
div.style.borderRadius = "10px";
div.style.boxShadow =
  "0 2px 8px rgba(0,0,0,0.1)";
    
    const link =
  "https://francisco-ivanir.github.io/carteira-online/?cliente=" +
  cliente.id;

div.innerHTML =
  "<strong>" +
  cliente.id +
  "</strong> - " +
  dados.nome +

  "<br>" +

  "Emprestado: " +
  formatarMoeda(dados.emprestado) +

  "<br>" +

  "Pago: " +
  formatarMoeda(dados.pago) +

  "<br>" +

  "Saldo: <strong style='color:" +

(dados.saldo > 0
  ? "red"
  : "green") +

"'>" +

formatarMoeda(dados.saldo) +

"</strong>" +

"<br><br>" +
    
  "<button onclick=\"window.open('" +
link +
"','_blank')\">Abrir</button> " +

"<button onclick=\"navigator.clipboard.writeText('" +
link +
"')\">Copiar Link</button>" +

" <button onclick=\"registrarPagamentoAdmin('" +
cliente.id +
"')\">Pagamento</button>" +

" <button onclick=\"editarCliente('" +
cliente.id +
"')\">Editar</button>" +

" <button onclick=\"excluirCliente('" +
cliente.id +
"')\">Excluir</button>";
    
    lista.appendChild(div);

  });

  document.getElementById(
  "resumo"
).innerHTML =

  "<strong>Clientes:</strong> " +
  clientesSnap.size +

  "<br><br>" +

  "<strong>Total Emprestado:</strong> R$ " +
  totalEmprestado.toLocaleString("pt-BR") +

  "<br>" +

  "<strong>Total Recebido:</strong> R$ " +
  totalPago.toLocaleString("pt-BR") +

  "<br>" +

  "<strong>Saldo em Aberto:</strong> R$ " +
  totalSaldo.toLocaleString("pt-BR");
  
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

async function excluirCliente(codigo) {

  const confirmacao =
    prompt(
      "Digite EXCLUIR para confirmar:"
    );

  if (
    confirmacao !== "EXCLUIR"
  ) {
    return;
  }

  try {

    await deleteDoc(
      doc(
        db,
        "clientes",
        codigo
      )
    );

    alert(
      "Cliente excluído!"
    );

    location.reload();

  } catch (erro) {

    alert(
      "Erro:\n\n" +
      erro.message
    );

  }

}

window.excluirCliente =
  excluirCliente;

function filtrarClientes() {

  const texto =
    document.getElementById("pesquisa")
    .value
    .toLowerCase();

  const clientes =
    document.querySelectorAll(".cliente");

  clientes.forEach((cliente) => {

    if (
      cliente.dataset.busca.includes(texto)
    ) {

      cliente.style.display = "";

    } else {

      cliente.style.display = "none";

    }

  });

}

window.filtrarClientes =
  filtrarClientes;

async function registrarPagamentoAdmin(
  codigoCliente
) {

  try {

    const valorTexto =
      prompt("Valor recebido:");

    if (!valorTexto) return;

    const valor =
      Number(
        valorTexto.replace(",", ".")
      );

    if (isNaN(valor)) return;

    let forma =
      prompt(
        "Forma de pagamento (PIX ou Dinheiro)"
      );

    if (!forma) {
      forma = "Não informado";
    }

   const clienteRef =
doc(
db,
"clientes",
codigoCliente
);

const clienteSnap =
await getDoc(clienteRef);

if (!clienteSnap.exists()) {

alert("Cliente não encontrado");
return;

}

const dadosCliente =
clienteSnap.data();

await addDoc(
  collection(
    db,
    "clientes",
    codigoCliente,
    "pagamentos"
  ),
  {
    data:
      new Date()
      .toLocaleDateString("pt-BR"),
    valor: valor,
    forma: forma
  }
);

const novoPago =
  (dadosCliente.pago || 0)
  + valor;

const novoSaldo =
  (dadosCliente.emprestado || 0)
  - novoPago;

await updateDoc(
  clienteRef,
  {
    pago: novoPago,
    saldo: novoSaldo
  }
);

alert(
  "Pagamento registrado com sucesso!"
);


  } catch (erro) {

    alert(
      "Erro:\n" +
      erro.message
    );

  }

}
window.registrarPagamentoAdmin =
  registrarPagamentoAdmin;
carregarClientes();
