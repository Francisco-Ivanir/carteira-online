
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  runTransaction
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

const UID_ADMIN = "p5VKHfDsmWaowPo3d0be5OVtW8B3";

async function carregarCarteira(codigoCliente) {
  try {
    const docRef = doc(db, "clientes", codigoCliente);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Cadastro do cliente não encontrado.");
      return;
    }

    const dados = docSnap.data();

    // Empréstimos
    const listaEmprestimos =
      document.getElementById("listaEmprestimos");

    listaEmprestimos.innerHTML = "";

    const emprestimosRef = collection(
      db, "clientes", codigoCliente, "emprestimos"
    );

    const emprestimosSnap = await getDocs(emprestimosRef);

    if (!emprestimosSnap.empty) {
      document.getElementById("modalEmprestimos").style.display = "block";

      const emprestimos = emprestimosSnap.docs.map(
  (documento) => ({
    id: documento.id,
    dados: documento.data()
  })
);

      function converterData(valor) {
        if (!valor) return 0;

        const partes = String(valor).split("/");

        if (partes.length === 3) {
          return new Date(
            Number(partes[2]),
            Number(partes[1]) - 1,
            Number(partes[0])
          ).getTime();
        }

        const dataConvertida = new Date(valor).getTime();

        return Number.isNaN(dataConvertida) ? 0 : dataConvertida;
      }

    emprestimos.sort(
  (a, b) =>
    converterData(b.dados.data) -
    converterData(a.dados.data)
);

     emprestimos.forEach((registro) => {

  const item = registro.dados;

  const div = document.createElement("div");
  div.style.marginBottom = "15px";

  const data = document.createElement("strong");
  data.textContent = item.data || "";
  div.appendChild(data);

  div.appendChild(document.createElement("br"));

  div.appendChild(
    document.createTextNode(
      "R$ " + Number(item.valor || 0).toLocaleString("pt-BR")
    )
  );

  div.appendChild(document.createElement("br"));

  div.appendChild(
    document.createTextNode(item.descricao || "")
  );

  // Botão disponível somente para o administrador
  if (
    auth.currentUser &&
    auth.currentUser.uid === UID_ADMIN
  ) {
    const botaoEditar = document.createElement("button");

    botaoEditar.type = "button";
    botaoEditar.textContent = "Editar";
    botaoEditar.style.marginTop = "8px";

    botaoEditar.addEventListener("click", () => {
      editarEmprestimoAdmin(
        codigoCliente,
        registro.id,
        Number(item.valor || 0),
        item.descricao || ""
      );
    });

    div.appendChild(document.createElement("br"));
    div.appendChild(botaoEditar);
  }

  listaEmprestimos.appendChild(div);

});

    } else {
      listaEmprestimos.innerHTML = "Nenhum empréstimo registrado.";
    }

    // Código do cliente
    document.getElementById("codigoCliente").innerText = codigoCliente;

    // Histórico de pagamentos
    const historico = document.getElementById("historico");
    historico.innerHTML = "";

    const pagamentosRef = collection(
      db, "clientes", codigoCliente, "pagamentos"
    );

    const pagamentosSnap = await getDocs(pagamentosRef);

    pagamentosSnap.forEach((pagamento) => {
      const item = pagamento.data();
      const li = document.createElement("li");

      li.innerText =
        (item.data || "") +
        " - R$ " +
        Number(item.valor || 0).toLocaleString("pt-BR") +
        " (" + (item.forma || "Não informado") + ")";

      historico.appendChild(li);
    });

    // Dados principais
    const emprestado = Number(dados.emprestado || 0);
    const pago = Number(dados.pago || 0);
    const saldo = Number(dados.saldo || 0);

    document.getElementById("nome").innerText = dados.nome || "";
    document.getElementById("emprestado").innerText =
      "R$ " + emprestado.toLocaleString("pt-BR");

    document.getElementById("pago").innerText =
      "R$ " + pago.toLocaleString("pt-BR");

    document.getElementById("saldo").innerText =
      "R$ " + saldo.toLocaleString("pt-BR");

    document.getElementById("saldoPix").innerText =
      "R$ " + saldo.toLocaleString("pt-BR");

    const percentual = emprestado > 0
      ? (pago / emprestado) * 100
      : 0;

    document.getElementById("percentual").innerText =
      percentual.toFixed(0);

    document.getElementById("barra").style.width =
      percentual + "%";

  } catch (erro) {
    console.error("Erro ao carregar carteira:", erro);
    alert("Não foi possível carregar sua carteira.\n\n" + erro.message);
  }
}

async function editarEmprestimoAdmin(
  codigoCliente,
  idEmprestimo,
  valorAtual,
  descricaoAtual
) {
  if (!auth.currentUser || auth.currentUser.uid !== UID_ADMIN) {
    alert("Apenas o administrador pode editar empréstimos.");
    return;
  }

  const valorDigitado = prompt(
    "Informe o novo valor do empréstimo:",
    Number(valorAtual).toFixed(2).replace(".", ",")
  );

  if (valorDigitado === null || valorDigitado.trim() === "") {
    return;
  }

  const novoValor = Number(
    valorDigitado.replace(/\./g, "").replace(",", ".")
  );

  if (!Number.isFinite(novoValor) || novoValor <= 0) {
    alert("Informe um valor válido e maior que zero.");
    return;
  }

  const novaDescricao = prompt(
    "Informe a nova descrição:",
    descricaoAtual
  );

  if (novaDescricao === null) {
    return;
  }

  if (!novaDescricao.trim()) {
    alert("A descrição não pode ficar vazia.");
    return;
  }

  const clienteRef = doc(db, "clientes", codigoCliente);

  const emprestimoRef = doc(
    db,
    "clientes",
    codigoCliente,
    "emprestimos",
    idEmprestimo
  );

  try {
    await runTransaction(db, async (transacao) => {
      const clienteSnap = await transacao.get(clienteRef);
      const emprestimoSnap = await transacao.get(emprestimoRef);

      if (!clienteSnap.exists() || !emprestimoSnap.exists()) {
        throw new Error("Cliente ou empréstimo não encontrado.");
      }

      const dadosCliente = clienteSnap.data();
      const dadosEmprestimo = emprestimoSnap.data();

      const valorAntigo = Number(dadosEmprestimo.valor || 0);

      const diferenca = Math.round(
        (novoValor - valorAntigo) * 100
      ) / 100;

      const novoEmprestado = Math.round(
        (Number(dadosCliente.emprestado || 0) + diferenca) * 100
      ) / 100;

      const novoSaldo = Math.round(
        (Number(dadosCliente.saldo || 0) + diferenca) * 100
      ) / 100;

      if (novoSaldo < -0.001 || novoEmprestado < 0) {
        throw new Error(
          "O novo valor não pode deixar o saldo devedor negativo."
        );
      }

      transacao.update(emprestimoRef, {
        valor: Math.round(novoValor * 100) / 100,
        descricao: novaDescricao.trim()
      });

      transacao.update(clienteRef, {
        emprestado: novoEmprestado,
        saldo: novoSaldo
      });
    });

    alert("Empréstimo atualizado com sucesso!");

    await carregarCarteira(codigoCliente);

  } catch (erro) {
    console.error("Erro ao editar empréstimo:", erro);
    alert("Não foi possível editar o empréstimo.\n\n" + erro.message);
  }
}

// Primeiro verifica a autenticação.
// Só depois permite consultar os dados do cliente.
onAuthStateChanged(auth, async (usuario) => {
  const params = new URLSearchParams(window.location.search);
  const codigoCliente = params.get("cliente");

  if (!codigoCliente) {
    alert("Link da carteira inválido. O código do cliente não foi informado.");
    return;
  }

  if (!usuario) {
    window.location.href =
      "login.html?cliente=" + encodeURIComponent(codigoCliente);
    return;
  }

 if (usuario.uid === UID_ADMIN) {
  await carregarCarteira(codigoCliente);
  return;
}

  try {
    const clienteRef = doc(db, "clientes", codigoCliente);
    const clienteSnap = await getDoc(clienteRef);

    if (
      !clienteSnap.exists() ||
      clienteSnap.data().authUid !== usuario.uid
    ) {
      await signOut(auth);

      window.location.href =
        "login.html?cliente=" + encodeURIComponent(codigoCliente);

      return;
    }

    await carregarCarteira(codigoCliente);

  } catch (erro) {
    console.error("Erro ao verificar acesso:", erro);
    alert("Não foi possível verificar seu acesso.\n\n" + erro.message);
  }
});
