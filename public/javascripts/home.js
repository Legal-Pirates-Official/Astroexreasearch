// javascript for Toggle Menu
var navlink = document.getElementById("nav-links");
var box = document.getElementById("box");
var home = document.getElementById("Home");
const ShowMenu = () => {
    navlink.style.width = '100%';
    box.style.left = '0%';
    document.querySelector('body').style.overflow = 'hidden';
}
const HideMenu = () => {
    navlink.style.width = '0%';
    box.style.left = '-20%';
    document.querySelector('body').style.overflow = 'scroll';
}
const backHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
}