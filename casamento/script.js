import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


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



document.addEventListener('DOMContentLoaded', function () {
  const toggleMenuBtn = document.getElementById('toggleMenu');
  const menu = document.getElementById('mobile');
  const menuOverlay = document.getElementById('menu-overlay');

  toggleMenuBtn.addEventListener('click', () => {
      const isOpen = menuOverlay.classList.contains('active');
      
      if (isOpen) {
          // Fecha o menu
          menuOverlay.classList.remove('active');
          menu.style.left = '-60vw';
      } else {
          // Abre o menu
          menuOverlay.classList.add('active');
          menu.style.left = '0';
      }
  });

  // Fecha ao clicar fora do menu
  menuOverlay.addEventListener('click', (e) => {
      if (e.target === menuOverlay) {
          menuOverlay.classList.remove('active');
          menu.style.left = '-60vw';
      }
  });
  // Fecha o menu ao clicar em qualquer item do menu lateral
const menuLinks = document.querySelectorAll('#mobile a');

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    menu.style.left = '-60vw';
  });
});

});




  // Contagem regressiva
const targetDate = new Date('2025-08-24T00:00:00');

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



// Função chamada ao clicar no botão "Presentear"
function reservarPresente(nome) {
  window.presenteSelecionado = nome; // Guarda o nome do presente
  abrirModal(); // Abre o modal
}

window.reservarPresente = reservarPresente;


// Função para abrir o modal
function abrirModal() {
  const modal = document.getElementById('modal-presente');
  modal.classList.add('active'); // Adiciona a classe que ativa a animação
  modal.style.display = 'flex';
}

// Função para fechar o modal
function fecharModal() {
  const modal = document.getElementById('modal-presente');
  modal.classList.remove('active'); // Remove a classe para resetar a animação
  setTimeout(() => {
    modal.style.display = 'none'; // Esconde após a animação
  }, 300); // Tempo em ms deve ser igual ao duration do CSS
  
  // Limpar os campos após o fechamento do modal
  document.getElementById('nome-presenteador').value = '';
  document.getElementById('email-presenteador').value = '';
  document.getElementById('mensagem-sucesso').style.display = 'none';
  document.getElementById('btn-pagar').style.display = 'none';
}

// Garantir que a função está acessível
window.fecharModal = fecharModal;



// Função para validar o formato do e-mail
function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

document.getElementById('confirmar-presente').addEventListener('click', async function () {
  const nome = document.getElementById('nome-presenteador').value.trim();
  const email = document.getElementById('email-presenteador').value.trim();
  const presente = window.presenteSelecionado; // Agora é o nome do presente

  if (nome === "" || email === "") {
    alert("Por favor, preencha todos os campos.");
  } else if (!validarEmail(email)) {
    alert("Por favor, insira um e-mail válido.");
  } else if (!presente) {
    alert("Erro ao identificar o presente selecionado.");
  } else {
    try {
      await salvarReserva(nome, email, presente); // Salva o nome do presente no banco de dados

      const mensagemSucesso = document.getElementById('mensagem-sucesso');
      mensagemSucesso.style.display = 'block';
      mensagemSucesso.innerHTML = `O presente foi reservado com sucesso!`;

      document.getElementById('btn-pagar').style.display = 'block';
    } catch (e) {
      alert("Erro ao salvar reserva. Tente novamente.");
    }
  }
});



// Função para redirecionar para o Mercado Pago
function continuarPagamento() {
  // Substitua o link abaixo pelo link correto do Mercado Pago
  window.location.href = "https://mpago.la/2kd9gDg";
}

// Garantir que a função está acessível
window.continuarPagamento = continuarPagamento;



fetch('presentes.json')
  .then(response => response.json())
  .then(presentes => {
    const container = document.getElementById('lista-presentes');

    presentes.forEach(presente => {
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
  });


fetch('padrinhos.json')
  .then(response => response.json())
  .then(padrinhos => {
    const container = document.getElementById("cards-padrinhos");

    padrinhos.forEach(padrinho => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${padrinho.foto}" alt="${padrinho.nome}">
        <h2>${padrinho.nome}</h2>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Erro ao carregar padrinhos:", error);
  });


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
  
  // Escutar em tempo real
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
  