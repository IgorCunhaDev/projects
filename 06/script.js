document.addEventListener("DOMContentLoaded", function () {
    const toggleMenuButton = document.getElementById("toggleMenu");
    const mobileMenu = document.getElementById("mobile");

    toggleMenuButton.addEventListener("click", function () {
        // Alterna a posição do menu
        if (mobileMenu.style.left === "0px") {
            mobileMenu.style.left = "-60vw";
        } else {
            mobileMenu.style.left = "0px";
        }
    });
});