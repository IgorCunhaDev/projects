const toggleButton = document.getElementById("toggle-menu");
const navMenu = document.getElementById("nav");

toggleButton.addEventListener("click", () => {
    navMenu.classList.toggle("show");
});