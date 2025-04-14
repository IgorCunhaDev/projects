document.addEventListener("DOMContentLoaded", function () {
    const toggleMenuButton = document.getElementById("toggleMenu");
    const mobileMenu = document.getElementById("mobile");

    // Alterna o menu ao clicar no botão
    toggleMenuButton.addEventListener("click", function () {
        if (mobileMenu.style.left === "0px") {
            mobileMenu.style.left = "-60vw"; // Fecha o menu
        } else {
            mobileMenu.style.left = "0px"; // Abre o menu
        }
    });

    const sidebarLinks = document.querySelectorAll('#sidebar a');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.style.left = "-60vw"; // Fecha o menu
        });
    });

    // Contagem regressiva
    const targetDate = new Date('2025-10-01T00:00:00'); // Data do casamento

    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            // Atualiza os valores no HTML
            document.getElementById('dias').textContent = days;
            document.getElementById('horas').textContent = hours;
            document.getElementById('minutos').textContent = minutes;
            document.getElementById('segundos').textContent = seconds;
        } else {
            // Quando a data for alcançada
            document.getElementById('contadorfilho').innerHTML = '<h2>Chegou a data!</h2>';
        }
    }

    // Atualiza o contador a cada segundo
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Chamada inicial para evitar atraso de 1 segundo
});


fetch('presentes.json')
  .then(response => response.json())
  .then(presentes => {
    const container = document.getElementById('lista-presentes');

    presentes.forEach(presente => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <img src="${presente.imagem}" alt="${presente.nome}">
        <h2>${presente.nome}</h2>
        <p>${presente.descricao}</p>
        <button onclick="reservarPresente(${presente.id})" ${presente.reservado ? 'disabled' : ''}>Presentear</button>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Erro ao carregar a lista de presentes:', error);
  });

// Função para marcar o presente como reservado
function reservarPresente(id) {
  // Carregar o arquivo JSON com os presentes
  fetch('presentes.json')
    .then(response => response.json())
    .then(presentes => {
      // Encontrar o presente pelo ID
      const presente = presentes.find(p => p.id === id);

      if (presente) {
        presente.reservado = true;  // Marca como reservado

        // Atualiza a interface (remover o botão ou desabilitá-lo)
        const container = document.getElementById('lista-presentes');
        container.innerHTML = '';  // Limpa o conteúdo atual

        // Recarregar a lista com os presentes atualizados
        presentes.forEach(presente => {
          const card = document.createElement('div');
          card.classList.add('card');

          card.innerHTML = `
            <img src="${presente.imagem}" alt="${presente.nome}">
            <h2>${presente.nome}</h2>
            <p>${presente.descricao}</p>
            <button onclick="reservarPresente(${presente.id})" ${presente.reservado ? 'disabled' : ''}>Presentear</button>
          `;

          container.appendChild(card);
        });

        // Aqui você pode adicionar lógica para salvar os dados de volta no JSON ou Google Sheets
        console.log(`Presente "${presente.nome}" foi reservado!`);
      }
    })
    .catch(error => {
      console.error('Erro ao atualizar os presentes:', error);
    });
}


