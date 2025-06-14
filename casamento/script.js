import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

//modal img
 const imagens = document.querySelectorAll('.img-local img, .padrinhos-container img');
  const modal = document.getElementById('modal-img');
  const modalImg = document.getElementById('imagem-ampliada');
  const fechar = document.querySelector('.fechar');

  imagens.forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = img.src;
    });
  });

  fechar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
});


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

  document.getElementById('btn-continuar').style.display = 'inline-block';
  document.getElementById('confirmar-presente').style.display = 'none';
  document.getElementById('aviso-reserva').style.display = 'none';
}

document.getElementById('btn-continuar').addEventListener('click', () => {
  // Mostrar aviso
  document.getElementById('aviso-reserva').style.display = 'block';

  // Mostrar botão Confirmar
  document.getElementById('confirmar-presente').style.display = 'inline-block';

  // Esconder botão Continuar
  document.getElementById('btn-continuar').style.display = 'none';
});

window.fecharModal = fecharModal;

function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

// Função para atualizar o campo 'reservado' do presente no Firestore
async function marcarPresenteComoReservado(nomeDoPresente) {
  console.log("Tentando marcar presente como reservado:", nomeDoPresente);
  
  const presente = todosPresentes.find(p => p.nome === nomeDoPresente);
  if (!presente) {
    console.error("Presente não encontrado.");
    return;
  }

  console.log("Presente encontrado:", presente);

  try {
    const presenteRef = doc(db, 'presentes', presente.firestoreId); // agora usa o ID real
    await updateDoc(presenteRef, { reservado: true });
    console.log("Presente marcado como reservado com sucesso!");
  } catch (error) {
    console.error("Erro ao marcar presente como reservado:", error);
  }
}


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


document.getElementById('confirmar-presente').addEventListener('click', async function () {
  const nome = document.getElementById('nome-presenteador').value.trim();
  const email = document.getElementById('email-presenteador').value.trim();
  const presente = window.presenteSelecionado;

  if (nome === "" || email === "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }
  if (!validarEmail(email)) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }
  if (!presente) {
    alert("Erro ao identificar o presente selecionado.");
    return;
  }

  try {
    // Primeiro salva a reserva (sua função existente)
    await salvarReserva(nome, email, presente);

    // Depois marca o presente como reservado no Firestore
    await marcarPresenteComoReservado(presente);

    // Atualiza o array local para refletir o status reservado
    todosPresentes = todosPresentes.map(item => {
      if (item.nome === presente) {
        return { ...item, reservado: true };
      }
      return item;
    });

    // Renderiza novamente a lista para ocultar o presente reservado
    renderizarPresentes(todosPresentes);

    // Mensagem de sucesso e botão de pagamento
    const mensagemSucesso = document.getElementById('mensagem-sucesso');
    mensagemSucesso.style.display = 'block';
    mensagemSucesso.innerHTML = 'O presente foi reservado com sucesso!';

    document.getElementById('aviso-reserva').style.display = 'none';
    document.getElementById('confirmar-presente').style.display = 'none';

    document.getElementById('btn-pagar').style.display = 'block';

  } catch (e) {
    alert("Erro ao salvar reserva. Tente novamente.");
  }
});


// Redirecionar para Mercado Pago
function continuarPagamento() {
  window.open("https://mpago.la/2kd9gDg", "_blank");
  fecharModal();
  window.scrollTo(0, 0); // Opcional
}

window.continuarPagamento = continuarPagamento;




let todosPresentes = [];
let itensVisiveis = 6; // Inicialmente, 6 itens visíveis

// Função para renderizar os presentes
function renderizarPresentes(lista) {
  const container = document.getElementById('lista-presentes');
  const verMaisBtn = document.getElementById('verMaisBtn');
  const verMenosBtn = document.getElementById('verMenosBtn');

  // Mostrar só presentes que NÃO estão reservados
  const presentesDisponiveis = lista.filter(presente => !presente.reservado);

  container.innerHTML = '';

  const itensParaExibir = presentesDisponiveis.slice(0, itensVisiveis);

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
      <button onclick="reservarPresente('${presente.nome}')">
        Presentear
      </button>
    `;

    container.appendChild(card);
  });

  if (itensVisiveis >= presentesDisponiveis.length) {
    verMaisBtn.style.display = 'none';
  } else {
    verMaisBtn.style.display = 'block';
  }

  if (itensVisiveis > 6) {
    verMenosBtn.style.display = 'block';
  } else {
    verMenosBtn.style.display = 'none';
  }
}

// Carregar os dados dos presentes
const presentesRef = collection(db, 'presentes'); // 'presentes' é o nome da sua coleção no Firestore
const presentesQuery = query(presentesRef, orderBy('nome')); // opcional: ordena por nome

// Atualiza em tempo real com onSnapshot
onSnapshot(presentesQuery, (snapshot) => {
 todosPresentes = snapshot.docs.map(docSnapshot => {
  const data = docSnapshot.data();
  return {
    ...data,
     firestoreId: docSnapshot.id  // garante que o ID real do Firestore seja mantido
  };
});

  renderizarPresentes(todosPresentes);
});


// Função para mostrar mais itens
function mostrarMais() {
  itensVisiveis += 6;  
  renderizarPresentes(todosPresentes);  
}

// Função para mostrar menos itens
function mostrarMenos() {
  if (itensVisiveis > 6) {
    itensVisiveis -= 6;  
    renderizarPresentes(todosPresentes);  
  }
}

// Filtro de Categoria
document.getElementById('filtro-categoria').addEventListener('change', function () {
  const categoriaSelecionada = this.value;
  if (categoriaSelecionada === 'todos') {
    renderizarPresentes(todosPresentes);  
  } else {
    const filtrados = todosPresentes.filter(p => p.categoria === categoriaSelecionada);
    renderizarPresentes(filtrados);  
  }
});

// Atribuir as funções aos botões
document.getElementById('verMaisBtn').addEventListener('click', mostrarMais);
document.getElementById('verMenosBtn').addEventListener('click', mostrarMenos);


// Comentários em Tempo Real
const form = document.getElementById('form-comentario');


// Submissão de comentário
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  const statusMsg = document.getElementById('mensagem-status');

  if (nome && mensagem) {
    try {
      await addDoc(collection(db, 'comentarios'), {
        nome,
        mensagem,
        timestamp: serverTimestamp()
      });

      form.reset();
      form.style.display = 'none'; 
      statusMsg.textContent = 'Recado enviado com sucesso!';
      statusMsg.style.display = 'flex';
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      statusMsg.textContent = 'Erro ao enviar comentário. Tente novamente.';
      statusMsg.style.display = 'block';
      statusMsg.style.color = 'red';
    }
  }
});


    // === CONFIRMAÇÃO DE PRESENÇA ===

// Elementos principais
const formConfirmacao = document.getElementById("form-confirmacao");
const camposAdicionais = document.getElementById("campos-adicionais");
const adultosSelect = document.getElementById("adultos");
const criancasSelect = document.getElementById("criancas");
const acompanhantesAdultosDiv = document.getElementById("acompanhantes-adultos");
const acompanhantesCriancasDiv = document.getElementById("acompanhantes-criancas");
const radios = document.querySelectorAll('input[name="presenca"]');

// === 1. Exibir/Ocultar campos adicionais conforme a escolha ===
radios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "Sim") {
      camposAdicionais.style.display = "block";
    } else {
      camposAdicionais.style.display = "none";
      acompanhantesAdultosDiv.innerHTML = "";
      acompanhantesCriancasDiv.innerHTML = "";
    }
  });
});

// === 2. Gerar dinamicamente inputs para acompanhantes adultos ===
adultosSelect.addEventListener("change", () => {
  acompanhantesAdultosDiv.innerHTML = "";
  const qtd = parseInt(adultosSelect.value);
  for (let i = 2; i <= qtd; i++) {
    const label = document.createElement("label");
    label.textContent = `Acompanhante(s)`;
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Nome do acompanhante`;
    input.classList.add("adulto-input");
    input.required = true;

    acompanhantesAdultosDiv.appendChild(label);
    acompanhantesAdultosDiv.appendChild(input);
  }
});

// === 3. Gerar dinamicamente inputs para acompanhantes crianças ===
criancasSelect.addEventListener("change", () => {
  acompanhantesCriancasDiv.innerHTML = "";
  const qtd = parseInt(criancasSelect.value);
  for (let i = 1; i <= qtd; i++) {
    const label = document.createElement("label");
    label.textContent = `Criança`;
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Nome da criança`;
    input.classList.add("crianca-input");
    input.required = true;

    acompanhantesCriancasDiv.appendChild(label);
    acompanhantesCriancasDiv.appendChild(input);
  }
});

// === 4. Envio dos dados para o Firestore ===
formConfirmacao.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Captura dos dados principais
  const nome = document.getElementById("nome-confirmacao").value.trim();
  const sobrenome = document.getElementById("sobrenome").value.trim();
  const presenca = document.querySelector('input[name="presenca"]:checked').value;
  const telefone = document.getElementById("telefone").value.trim();
  const observacoes = document.getElementById("observacoes").value.trim();
  const qtdAdultos = parseInt(adultosSelect.value);
  const qtdCriancas = parseInt(criancasSelect.value);

  // Captura acompanhantes adultos
  const nomesAdultos = Array.from(document.querySelectorAll(".adulto-input"))
    .map(input => input.value.trim()).filter(v => v !== "");

  // Captura acompanhantes crianças
  const nomesCriancas = Array.from(document.querySelectorAll(".crianca-input"))
    .map(input => input.value.trim()).filter(v => v !== "");

  console.log("Nomes Adultos:", nomesAdultos); // Verifique se os dados dos acompanhantes adultos estão sendo capturados corretamente
  console.log("Nomes Crianças:", nomesCriancas); // Verifique se os dados das crianças estão sendo capturados corretamente

  try {
    // Envio para o Firestore
    await addDoc(collection(db, "confirmacoes"), {
      nomeCompleto: `${nome} ${sobrenome}`,
      presenca,
      quantidadeAdultos: qtdAdultos,
      nomesAdultos,
      quantidadeCriancas: qtdCriancas,
      nomesCriancas,
      telefone,
      observacoes,
      timestamp: serverTimestamp()
    });

    // Esconde o formulário
    formConfirmacao.style.display = "none";
    camposAdicionais.style.display = "none"; // Esconde os campos adicionais

    // Exibe a mensagem de confirmação
    const mensagem = document.getElementById("mensagem-confirmacao");
    mensagem.textContent = "Confirmação enviada com sucesso!";
    mensagem.style.display = "flex";  // Torna a mensagem visível

  } catch (err) {
    console.error("Erro ao enviar confirmação:", err);
    alert("Ocorreu um erro ao enviar. Tente novamente.");
  }
});
















