const dropdownAtag = document.querySelector(".dropdown-atag");
const dropdownNavbar = document.querySelector(".dropdown-navbar");
const navBtn = document.querySelector(".nav-btn");
const fullNav = document.querySelector('.nav-links-2');
let dropdownNavbarIsOpen = false;

dropdownAtag.addEventListener("mouseover", () => {
    dropdownNavbar.classList.add("show");
    dropdownNavbarIsOpen = true;
});

navBtn.addEventListener("click", (event) => {
    fullNav.classList.
});

dropdownAtag.addEventListener("click", () => {
    dropdownNavbar.classList.remove("show");
});
window.addEventListener("click", () => {
    dropdownNavbar.classList.remove("show");
});
