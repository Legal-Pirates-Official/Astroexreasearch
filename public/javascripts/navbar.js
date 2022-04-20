const dropdownAtag = document.querySelector(".dropdown-atag");
const dropdownNavbar = document.querySelector(".dropdown-navbar");

let dropdownNavbarIsOpen = false;

dropdownAtag.addEventListener("mouseover", () => {
    dropdownNavbar.classList.add("show");
    dropdownNavbarIsOpen = true;
});

// window.addEventListener("click", (event) => {
//     if (dropdownNavbarIsOpen) {
//         dropdownNavbar.classList.remove("show");
//         dropdownNavbarIsOpen = false;
//     }
// });

dropdownAtag.addEventListener("click", () => {
    dropdownNavbar.classList.remove("show");
});
window.addEventListener("click", () => {
    dropdownNavbar.classList.remove("show");
});
