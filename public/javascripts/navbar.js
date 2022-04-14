const dropdownAtag = document.querySelector(".dropdown-atag");
const dropdownNavbar = document.querySelector(".dropdown-navbar");

dropdownAtag.addEventListener("mouseover", () => {
    dropdownNavbar.classList.add("show");
});
dropdownAtag.addEventListener("click", () => {
    dropdownNavbar.classList.remove("show");
});
window.addEventListener("click", () => {
    dropdownNavbar.classList.remove("show");
});
