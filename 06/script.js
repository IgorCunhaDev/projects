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
