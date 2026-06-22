import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  increment
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
const params =
  new URLSearchParams(
    window.location.search
  );

const codigoCliente =
  params.get("cliente") ||
  "cliente-teste";
    
    const docRef = doc(
  db,
  "clientes",
  codigoCliente
);
    
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const dados = docSnap.data();
const historico =
  document.getElementById("historico");

historico.innerHTML = "";

const pagamentosRef = collection(
  db,
  "clientes",
  codigoCliente,
  "pagamentos"
);

const pagamentosSnap =
  await getDocs(pagamentosRef);

pagamentosSnap.forEach((pagamento) => {

  const item = pagamento.data();

  const li =
    document.createElement("li");

  li.innerText =
    item.data +
    " - R$ " +
    item.valor.toLocaleString("pt-BR") +
    " (" + item.forma + ")";

  historico.appendChild(li);

});
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

    } else {

      alert("Documento cliente-teste não encontrado.");

    }

  } catch (erro) {

    alert(
  "ERRO:\n\n" +
  erro.message
);

console.error(erro);

  }
async function registrarPagamentoFirebase() {

  try {
const params =
  new URLSearchParams(
    window.location.search
  );

const codigoCliente =
  params.get("cliente") ||
  "cliente-teste";
    
    const valorTexto =
      prompt("Valor recebido:");

    if (!valorTexto) return;

    const valor =
      Number(valorTexto.replace(",", "."));

    if (isNaN(valor)) return;

    let forma =
      prompt("Forma de pagamento (PIX ou Dinheiro)");

    if (!forma) {
      forma = "Não informado";
    }

    const hoje =
      new Date().toLocaleDateString("pt-BR");

    await addDoc(

  collection(
    db,
    "clientes",
    codigoCliente,
    "pagamentos"
  ),

      {
        data: hoje,
        valor: valor,
        forma: forma
      }

    );

    const clienteRef = doc(
  db,
  "clientes",
  codigoCliente
);

    await updateDoc(
      clienteRef,
      {
        pago: increment(valor),
        saldo: increment(-valor)
      }
    );

    alert(
      "Pagamento registrado com sucesso!"
    );

    location.reload();

  } catch (erro) {

    alert(
      "Erro ao salvar pagamento:\n\n" +
      erro.message
    );

  }

}
  window.registrarPagamentoFirebase =
  registrarPagamentoFirebase;
}

testarFirestore();
