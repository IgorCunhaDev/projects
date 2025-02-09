let index = 0;
        const images = document.querySelectorAll('.carrosel img');
        
        function showImage(i) {
            images.forEach(img => img.classList.remove('active'));
            images[i].classList.add('active');
        }
        
        function prevImage() {
            index = (index - 1 + images.length) % images.length;
            showImage(index);
        }
        
        function nextImage() {
            index = (index + 1) % images.length;
            showImage(index);
        }

        function updateCounter() {
            const startDate = new Date('2025-01-09T10:01:00'); // Data de nascimento ou qualquer data inicial que você escolher
            const currentDate = new Date();
            const diff = currentDate - startDate;
        
            // Calcular os valores para dias, horas, minutos e segundos
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
            // Atualizar os elementos do HTML
            document.getElementById('dias').textContent = days;
            document.getElementById('horas').textContent = hours;
            document.getElementById('minutos').textContent = minutes;
            document.getElementById('segundos').textContent = seconds;
        }
        
        // Atualizar a cada segundo
        setInterval(updateCounter, 1000);
        
        // Inicializa o contador
        updateCounter();
