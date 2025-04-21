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
});




  // Contagem regressiva
const targetDate = new Date('2025-10-01T00:00:00');

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
function reservarPresente(id) {
  window.presenteSelecionado = id; // Guarda o ID do presente
  abrirModal(); // Abre o modal
}

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

  document.getElementById('nome-presenteador').value = '';
  document.getElementById('email-presenteador').value = '';
  document.getElementById('mensagem-sucesso').style.display = 'none';
  document.getElementById('btn-pagar').style.display = 'none';
}


// Função para validar o formato do e-mail
function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

// Lógica para o botão de confirmação
document.getElementById('confirmar-presente').addEventListener('click', function() {
  const nome = document.getElementById('nome-presenteador').value.trim();
  const email = document.getElementById('email-presenteador').value.trim();

  // Verificar se os campos nome e e-mail não estão vazios
  if (nome === "" || email === "") {
    alert("Por favor, preencha todos os campos.");
  } else if (!validarEmail(email)) {
    alert("Por favor, insira um e-mail válido.");
  } else {
    // Exibe a mensagem de sucesso dentro do modal
    const mensagemSucesso = document.getElementById('mensagem-sucesso');
    mensagemSucesso.style.display = 'block';
    mensagemSucesso.innerHTML = `O presente foi reservado com sucesso!`;

    // Exibe o botão de pagamento dentro do modal
    document.getElementById('btn-pagar').style.display = 'block';

    // Fechar o modal após a confirmação
    // Não estamos fechando o modal ainda, pois a mensagem e o botão permanecem no modal.
  }
});

// Função para redirecionar para o Mercado Pago
function continuarPagamento() {
  // Substitua 'ID_DO_PAGAMENTO' por um ID real do pagamento
  window.location.href = "https://mpago.la/2kd9gDg";
}


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
        <button onclick="reservarPresente(${presente.id})" ${presente.reservado ? 'disabled' : ''}>
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
