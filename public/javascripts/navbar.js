const dropdownAtag = document.querySelector(".dropdown-atag");
const dropdownNavbar = document.querySelector(".dropdown-navbar");
const navBtn = document.querySelector(".nav-btn");
const dropdown = document.querySelectorAll(".dropdown");
const dropdownContent = document.querySelector(".dropdown-content");
const fullNav = document.querySelector(".nav-links-2");
let dropdownNavbarIsOpen = false;

dropdown.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    document.querySelectorAll(`.mobiledrop`).forEach((dropdownContent) => {
        dropdownContent.style.display = "none";
    })
    console.log("clicked",dropdown.getAttribute('data-attr'));
   const name = dropdown.getAttribute('data-attr')
    document.querySelector(`.${name}`).style.display = "flex";
  })
});
dropdownAtag.addEventListener("mouseover", () => {
  dropdownNavbar.classList.add("show");
  dropdownNavbarIsOpen = true;
});

// navBtn.addEventListener("click", (event) => {
//     fullNav.classList.
// });

dropdownAtag.addEventListener("click", () => {
  dropdownNavbar.classList.remove("show");
});
window.addEventListener("click", () => {
  dropdownNavbar.classList.remove("show");
});
