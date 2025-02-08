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

document.getElementById('')