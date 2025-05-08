import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Função para salvar a reserva
export async function salvarReserva(nome, email, presente) {
  try {
    await addDoc(collection(db, "reservas"), {
      nome,
      email,
      presente,
      data: new Date()
    });
    console.log("Reserva salva!");
  } catch (e) {
    console.error("Erro ao salvar reserva: ", e);
  }
}

// Menu Responsivo
document.addEventListener('DOMContentLoaded', function () {
  const toggleMenuBtn = document.getElementById('toggleMenu');
  const menu = document.getElementById('mobile');
  const menuOverlay = document.getElementById('menu-overlay');

  toggleMenuBtn.addEventListener('click', () => {
    const isOpen = menuOverlay.classList.contains('active');
    if (isOpen) {
      menuOverlay.classList.remove('active');
      menu.style.left = '-60vw';
    } else {
      menuOverlay.classList.add('active');
      menu.style.left = '0';
    }
  });

  // Fecha o menu ao clicar fora
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) {
      menuOverlay.classList.remove('active');
      menu.style.left = '-60vw';
    }
  });

  // Fecha o menu ao clicar nos links
  const menuLinks = document.querySelectorAll('#mobile a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOverlay.classList.remove('active');
      menu.style.left = '-60vw';
    });
  });
});

// Contagem Regressiva
const targetDate = new Date('2025-10-23T00:00:00');
function updateCountdown() {
  const now = new Date();
  const difference = targetDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    document.getElementById('dias').textContent = days;
    document.getElementById('horas').textContent = hours;
    document.getElementById('minutos').textContent = minutes;
    document.getElementById('segundos').textContent = seconds;
  } else {
    document.getElementById('contadorfilho').innerHTML = '<h2>Chegou a data!</h2>';
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Modal de Presente
function abrirModal() {
  const modal = document.getElementById('modal-presente');
  modal.classList.add('active');
  modal.style.display = 'flex';
}

// Função chamada ao clicar no botão "Presentear"
window.reservarPresente = function(nomeDoPresente) {
  window.presenteSelecionado = nomeDoPresente; // salva globalmente
  abrirModal(); // abre o modal
};


function fecharModal() {
  const modal = document.getElementById('modal-presente');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);

  // Limpar os campos
  document.getElementById('nome-presenteador').value = '';
  document.getElementById('email-presenteador').value = '';
  document.getElementById('mensagem-sucesso').style.display = 'none';
  document.getElementById('btn-pagar').style.display = 'none';
}

window.fecharModal = fecharModal;

function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

document.getElementById('confirmar-presente').addEventListener('click', async function () {
  const nome = document.getElementById('nome-presenteador').value.trim();
  const email = document.getElementById('email-presenteador').value.trim();
  const presente = window.presenteSelecionado;

  if (nome === "" || email === "") {
    alert("Por favor, preencha todos os campos.");
  } else if (!validarEmail(email)) {
    alert("Por favor, insira um e-mail válido.");
  } else if (!presente) {
    alert("Erro ao identificar o presente selecionado.");
  } else {
    try {
      await salvarReserva(nome, email, presente);
      const mensagemSucesso = document.getElementById('mensagem-sucesso');
      mensagemSucesso.style.display = 'block';
      mensagemSucesso.innerHTML = 'O presente foi reservado com sucesso!';

      document.getElementById('btn-pagar').style.display = 'block';
    } catch (e) {
      alert("Erro ao salvar reserva. Tente novamente.");
    }
  }
});

// Redirecionar para Mercado Pago
function continuarPagamento() {
  window.location.href = "https://mpago.la/2kd9gDg";
}

window.continuarPagamento = continuarPagamento;

let todosPresentes = [];
let itensVisiveis = 6; // Inicialmente, 6 itens visíveis

// Função para renderizar os presentes
function renderizarPresentes(lista) {
  const container = document.getElementById('lista-presentes');
  const verMaisBtn = document.getElementById('verMaisBtn');
  const verMenosBtn = document.getElementById('verMenosBtn');

  // Limpa o conteúdo do container
  container.innerHTML = '';

  // Exibe apenas os itens visíveis
  const itensParaExibir = lista.slice(0, itensVisiveis);

  // Criar os cards para os itens visíveis
  itensParaExibir.forEach(presente => {
    const card = document.createElement('div');
    card.classList.add('card');

    const valorFormatado = presente.valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    card.innerHTML = `
      <img src="${presente.imagem}" alt="${presente.nome}">
      <p>${presente.nome}</p>
      <p class="preco">${valorFormatado}</p>
      <button onclick="reservarPresente('${presente.nome}')" ${presente.reservado ? 'disabled' : ''}>
        ${presente.reservado ? 'Reservado' : 'Presentear'}
      </button>
    `;

    container.appendChild(card);
  });

  // Mostrar/Esconder o botão "Ver Mais" ou "Ver Menos"
  if (itensVisiveis >= lista.length) {
    verMaisBtn.style.display = 'none';  // Esconde o botão "Ver Mais" quando todos os itens são exibidos
  } else {
    verMaisBtn.style.display = 'block';  // Exibe o botão "Ver Mais"
  }

  if (itensVisiveis > 6) {
    verMenosBtn.style.display = 'block';  // Exibe o botão "Ver Menos"
  } else {
    verMenosBtn.style.display = 'none';  // Esconde o botão "Ver Menos"
  }
}

// Carregar os dados dos presentes
fetch('presentes.json')
  .then(response => response.json())
  .then(presentes => {
    todosPresentes = presentes;
    renderizarPresentes(todosPresentes);  // Renderiza a lista inicial de presentes
  })
  .catch(error => console.error('Erro ao carregar os presentes:', error));

// Função para mostrar mais itens
function mostrarMais() {
  itensVisiveis += 6;  // Aumenta a quantidade de itens visíveis
  renderizarPresentes(todosPresentes);  // Re-renderiza a lista
}

// Função para mostrar menos itens
function mostrarMenos() {
  if (itensVisiveis > 6) {
    itensVisiveis -= 6;  // Diminui a quantidade de itens visíveis
    renderizarPresentes(todosPresentes);  // Re-renderiza a lista
  }
}

// Filtro de Categoria
document.getElementById('filtro-categoria').addEventListener('change', function () {
  const categoriaSelecionada = this.value;
  if (categoriaSelecionada === 'todos') {
    renderizarPresentes(todosPresentes);  // Mostra todos os presentes
  } else {
    const filtrados = todosPresentes.filter(p => p.categoria === categoriaSelecionada);
    renderizarPresentes(filtrados);  // Mostra apenas os presentes filtrados
  }
});

// Atribuir as funções aos botões
document.getElementById('verMaisBtn').addEventListener('click', mostrarMais);
document.getElementById('verMenosBtn').addEventListener('click', mostrarMenos);


// Comentários em Tempo Real
const form = document.getElementById('form-comentario');
const lista = document.getElementById('lista-comentarios');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  if (nome && mensagem) {
    try {
      await addDoc(collection(db, 'comentarios'), {
        nome,
        mensagem,
        timestamp: serverTimestamp()
      });
      form.reset();
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    }
  }
});

const q = query(collection(db, 'comentarios'), orderBy('timestamp', 'desc'));
onSnapshot(q, (snapshot) => {
  lista.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.innerHTML = `<strong>${data.nome}</strong><p>${data.mensagem}</p>`;
    lista.appendChild(div);
  });
});
