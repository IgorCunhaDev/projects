import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDZYRZwahyKBMaORKtItntC6WoAbQcCKTQ",
  authDomain: "casamento-48661.firebaseapp.com",
  projectId: "casamento-48661",
  storageBucket: "casamento-48661.firebasestorage.app",
  messagingSenderId: "391104692884",
  appId: "1:391104692884:web:b69c3149949d2da8ba2a81"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// E-mail e senha fixos do administrador
const ADMIN_EMAIL = "gabbathaigor@gmail.com"; // E-mail do administrador
const ADMIN_PASSWORD = "84861963Ic"; // Senha do administrador

// Função para inicializar a página administrativa após login
function iniciarPainel() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("wrapper").style.display = "flex";
  document.body.classList.add("logged-in");
  listarReservas();
  listarComentarios();
}



// Login de usuário (apenas um login permitido)
// Login de usuário (apenas um login permitido)
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const senha = document.getElementById("password").value;
      const erro = document.getElementById("loginError");

      // Verifique se o email e senha estão corretos
      if (email === ADMIN_EMAIL && senha === ADMIN_PASSWORD) {
        try {
          erro.textContent = "";
          iniciarPainel(); // Função para carregar o painel administrativo
        } catch (err) {
          erro.textContent = "Erro no login. Tente novamente.";
        }
      } else {
        erro.textContent = "Email ou senha incorretos.";
      }
    });
  } else {
    console.error("Elemento com ID 'loginBtn' não encontrado.");
  }
});


// Verificação de estado do usuário (login ou logout)
onAuthStateChanged(auth, (user) => {
  if (user) {
    iniciarPainel();
  }
});


// Função para listar as reservas de presentes
async function listarReservas() {
  const reservasRef = collection(db, "reservas");
  const querySnapshot = await getDocs(reservasRef);
  const listaReservas = document.getElementById('lista-reservas-ul');
  listaReservas.innerHTML = ''; // Limpa apenas a UL

  let index = 0;
  querySnapshot.forEach(doc => {
    const reserva = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${reserva.nome}</strong> <strong>(${reserva.email})</strong><br> reservou o presente: ${reserva.presente}
    `;
    li.style.padding = '12px';
    li.style.marginBottom = '6px';
    li.style.backgroundColor = index % 2 === 0 ? '#e9f1f6' : '#ffffff';

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.style.marginLeft = '10px';
    btnExcluir.addEventListener('click', () => excluirReserva(doc.id));
    li.appendChild(btnExcluir);

    listaReservas.appendChild(li);
    index++;
  });
}

// Função para excluir uma reserva
async function excluirReserva(reservaId) {
  const confirmacao = confirm("Tem certeza que deseja excluir esta reserva?");
  if (confirmacao) {
    try {
      const reservaRef = doc(db, "reservas", reservaId);
      await deleteDoc(reservaRef);
      alert("Reserva excluída com sucesso!");
      listarReservas(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error("Erro ao excluir reserva: ", error);
    }
  }
}


// Função para listar presentes com botão para alterar reservado (true/false)
async function listarPresentes() {
  const presentesRef = collection(db, "presentes");
  const querySnapshot = await getDocs(presentesRef);
  const listaPresentes = document.getElementById('lista-presentes-ul');
  listaPresentes.innerHTML = ''; // limpa a lista

  let index = 0;
  querySnapshot.forEach(docSnap => {
    const presente = docSnap.data();
    const li = document.createElement('li');
    li.classList.add("card-presente"); // classe de estilo

li.innerHTML = `
  <span class="presente-nome">${presente.nome}</span>
  <span class="presente-status ${presente.reservado ? 'reservado' : 'disponivel'}">
    ${presente.reservado ? 'Reservado' : 'Disponível'}
  </span>
`;


    const btnToggle = document.createElement('button');
    btnToggle.textContent = presente.reservado ? 'Marcar como Disponível' : 'Marcar como Reservado';
  btnToggle.classList.add('btn-reservar');


    btnToggle.addEventListener('click', async () => {
      await atualizarStatusPresente(docSnap.id, !presente.reservado);
      listarPresentes(); // Atualiza lista após mudança
    });

    li.appendChild(btnToggle);
    listaPresentes.appendChild(li);
    index++;
  });
}

async function atualizarStatusPresente(presenteId, novoStatus) {
  try {
    const presenteRef = doc(db, "presentes", presenteId);
    await updateDoc(presenteRef, { reservado: novoStatus });
    alert(`Presente atualizado para ${novoStatus ? "Reservado" : "Disponível"}`);
  } catch (error) {
    console.error("Erro ao atualizar status do presente:", error);
  }
}


// Função para listar os comentários
async function listarComentarios() {
  const comentariosRef = collection(db, "comentarios");
  const querySnapshot = await getDocs(comentariosRef);
  const listaComentarios = document.getElementById('lista-comentarios-ul');
  listaComentarios.innerHTML = ''; // Limpa apenas a UL

  let index = 0;
  querySnapshot.forEach(doc => {
    const comentario = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `<strong>${comentario.nome}:</strong> ${comentario.mensagem}`;
    li.style.padding = '12px';
    li.style.marginBottom = '6px';
    li.style.backgroundColor = index % 2 === 0 ? '#e9f1f6' : '#ffffff';

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.style.marginLeft = '10px';
    btnExcluir.addEventListener('click', () => excluirComentario(doc.id));
    li.appendChild(btnExcluir);

    listaComentarios.appendChild(li);
    index++;
  });
}

// Função para excluir um comentário
async function excluirComentario(comentarioId) {
  const confirmacao = confirm("Tem certeza que deseja excluir este comentário?");
  if (confirmacao) {
    try {
      const comentarioRef = doc(db, "comentarios", comentarioId);
      await deleteDoc(comentarioRef);
      alert("Comentário excluído com sucesso!");
      listarComentarios(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error("Erro ao excluir comentário: ", error);
    }
  }
}

async function mostrarConfirmacoesPresenca() {
  const listaUl = document.getElementById("lista-confirmacoes-ul");
  listaUl.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "confirmacoes"));
  querySnapshot.forEach(doc => {
    const data = doc.data();

    // Montar texto com acompanhantes adultos e crianças
    const adultosTexto = data.nomesAdultos && data.nomesAdultos.length > 0
      ? data.nomesAdultos.join(", ")
      : "Nenhum acompanhante adulto";

    const criancasTexto = data.nomesCriancas && data.nomesCriancas.length > 0
      ? data.nomesCriancas.join(", ")
      : "Nenhuma criança";

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${data.nomeCompleto}</strong><br>
      Presença: ${data.presenca}<br>
      Adultos (incluindo acompanhante): ${data.quantidadeAdultos}<br>
      Acompanhantes adultos: ${adultosTexto}<br>
      Crianças: ${data.quantidadeCriancas}<br>
      Nomes das crianças: ${criancasTexto}<br>
      Telefone: ${data.telefone}<br>
      Observações: ${data.observacoes}
    `;

    listaUl.appendChild(li);
  });
}


// Alternando entre seções com base no item selecionado do menu lateral
  const reservasBtn = document.getElementById("reservasBtn");
  const comentariosBtn = document.getElementById("comentariosBtn");
  const confirmacaoBtn = document.getElementById("confirmacaoBtn");
  const presentesBtn = document.getElementById("presentesBtn");

 presentesBtn.addEventListener("click", () => {
  mostrarSecao("lista-presentes");
  listarPresentes();
});

reservasBtn.addEventListener("click", () => {
  mostrarSecao("lista-reservas");
  listarReservas();
});

comentariosBtn.addEventListener("click", () => {
  mostrarSecao("lista-comentarios");
  listarComentarios();
});

confirmacaoBtn.addEventListener("click", () => {
  mostrarSecao("lista-confirmacao");
  mostrarConfirmacoesPresenca();
}); // ← Última chave deve ser essa



  

  // Função para mostrar a seção correta
  function mostrarSecao(secaoId) {
    const secoes = document.querySelectorAll(".content-section");
    secoes.forEach(secao => {
      if (secao.id === secaoId) {
        secao.style.display = "block";
      } else {
        secao.style.display = "none";
      }
    });
  }


  const toggleSidebarBtn = document.createElement('button');
  toggleSidebarBtn.textContent = '☰';
  toggleSidebarBtn.classList.add('toggle-sidebar');

  document.body.appendChild(toggleSidebarBtn);

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay'); // Defina o overlay no JS também
  const botaoFixo = document.getElementById('botao-fixo'); // Caso você tenha um botão fixo

  // Abre ou fecha o sidebar
  toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active'); // Alterna a classe 'active' no sidebar
    const ativo = sidebar.classList.contains('active');
    overlay.style.display = ativo ? 'block' : 'none';
    botaoFixo.style.display = ativo ? 'none' : 'block'; // Esconde o botão fixo quando o menu está aberto
  });

  // Fechar o sidebar ao clicar no overlay
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active'); // Remove a classe 'active' do sidebar
    overlay.style.display = 'none'; // Oculta o overlay
    botaoFixo.style.display = 'block'; // Mostra o botão fixo novamente
  });

  // Fechar o sidebar ao clicar em qualquer item do menu
  const menuItems = document.querySelectorAll('#sidebar .components li a');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      sidebar.classList.remove('active'); // Remove a classe 'active' do sidebar
      overlay.style.display = 'none'; // Oculta o overlay
      botaoFixo.style.display = 'block'; // Mostra o botão fixo novamente
    });
  });

  // Alternar para a seção de adicionar presente
const adicionarPresenteBtn = document.getElementById("adicionarPresenteBtn");
adicionarPresenteBtn.addEventListener("click", () => {
  mostrarSecao("adicionar-presente");
});

// Função para adicionar presente ao Firestore
const formAdicionarPresente = document.getElementById("form-adicionar-presente");

if (formAdicionarPresente) {
  formAdicionarPresente.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const categoria = document.getElementById("categoria").value;
    const imagem = document.getElementById("imagem").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const linkPagamento = document.getElementById("linkPagamento").value;

    try {
      await addDoc(collection(db, "presentes"), {
        nome,
        categoria,
        imagem,
        valor,
        linkPagamento,
        reservado: false
      });

      alert("Presente adicionado com sucesso!");
      formAdicionarPresente.reset(); // limpa o formulário
      listarPresentes(); // atualiza a lista de presentes
      mostrarSecao("lista-presentes"); // volta pra seção da lista
    } catch (error) {
      console.error("Erro ao adicionar presente:", error);
      alert("Erro ao adicionar presente.");
    }
  });
}


