import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

// Login de usuário (apenas um login permitido)
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;
  const erro = document.getElementById("loginError");

  // Verifica se o email e senha são os definidos
  if (email === ADMIN_EMAIL && senha === ADMIN_PASSWORD) {
    try {
      // Loga diretamente sem usar o Firebase Auth, já que são fixos
      erro.textContent = "";
      document.getElementById("loginModal").style.display = "none"; // Fecha o modal após login
      iniciarPainel(); // Função que pode carregar o painel administrativo
    } catch (err) {
      erro.textContent = "Erro no login. Tente novamente.";
    }
  } else {
    erro.textContent = "Email ou senha incorretos.";
  }
});

// Verificação de estado do usuário (login ou logout)
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("loginModal").style.display = "none";
    iniciarPainel();
  }
});

// Função para listar as reservas de presentes
async function listarReservas() {
  const reservasRef = collection(db, "reservas");
  const querySnapshot = await getDocs(reservasRef);
  const listaReservas = document.getElementById('lista-reservas');
  listaReservas.innerHTML = ''; // Limpa a lista antes de preencher

  querySnapshot.forEach(doc => {
    const reserva = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${reserva.nome}</strong> <strong>(${reserva.email})</strong> <br> reservou o presente: ${reserva.presente} 
    `;
    
    // Criar o botão de excluir e adicionar o ouvinte de evento
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', () => excluirReserva(doc.id)); // Adiciona o ouvinte de evento
    li.appendChild(btnExcluir);

    listaReservas.appendChild(li);
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

// Função para listar os comentários
async function listarComentarios() {
  const comentariosRef = collection(db, "comentarios");
  const querySnapshot = await getDocs(comentariosRef);
  const listaComentarios = document.getElementById('lista-comentarios');
  listaComentarios.innerHTML = ''; // Limpa antes de preencher

  querySnapshot.forEach(doc => {
    const comentario = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `<strong>${comentario.nome}:</strong> ${comentario.mensagem} `;

    // Criar o botão de excluir e adicionar o ouvinte de evento
    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', () => excluirComentario(doc.id)); // Adiciona o ouvinte de evento
    li.appendChild(btnExcluir);

    listaComentarios.appendChild(li);
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

// Inicializa as funções ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  listarReservas();
  listarComentarios();
});
