const slideDiv1 = document.querySelector(".slide-div1");
const slideDiv2 = document.querySelector(".slide-div2");
const slideDiv3 = document.querySelector(".slide-div3");
const slideDiv4 = document.querySelector(".slide-div4");
const slideDiv5 = document.querySelector(".slide-div5");

const slideDivH1One = document.querySelector(".slide-div-h1-one");
const slideDivH1Two = document.querySelector(".slide-div-h1-two");
const slideDivH1Three = document.querySelector(".slide-div-h1-three");
const slideDivH1Four = document.querySelector(".slide-div-h1-four");
const slideDivH1Five = document.querySelector(".slide-div-h1-five");

// const swiper = (h1Tag, divTag, className) => {
//     h1Tag.addEventListener("click", () => {
//         divTag.classList.toggle(className);
//     });
// };

// swiper(slideDivH1One, slideDiv1, "slide-div-active1");
// swiper(slideDivH1Two, slideDiv2, "slide-div-active2");
// swiper(slideDivH1Three, slideDiv3, "slide-div-active3");
// swiper(slideDivH1Four, slideDiv4, "slide-div-active4");
// swiper(slideDivH1Five, slideDiv5, "slide-div-active5");

slideDivH1One.addEventListener("click", () => {
    slideDiv1.classList.toggle("slide-div-active1");
    slideDiv2.classList.remove("slide-div-active2");
    slideDiv3.classList.remove("slide-div-active3");
    slideDiv4.classList.remove("slide-div-active4");
    slideDiv5.classList.remove("slide-div-active5");
});
slideDivH1Two.addEventListener("click", () => {
    slideDiv1.classList.remove("slide-div-active1");
    slideDiv2.classList.toggle("slide-div-active2");
    slideDiv3.classList.remove("slide-div-active3");
    slideDiv4.classList.remove("slide-div-active4");
    slideDiv5.classList.remove("slide-div-active5");
});
slideDivH1Three.addEventListener("click", () => {
    slideDiv1.classList.remove("slide-div-active1");
    slideDiv2.classList.remove("slide-div-active2");
    slideDiv3.classList.toggle("slide-div-active3");
    slideDiv4.classList.remove("slide-div-active4");
    slideDiv5.classList.remove("slide-div-active5");
});
slideDivH1Four.addEventListener("click", () => {
    slideDiv1.classList.remove("slide-div-active1");
    slideDiv2.classList.remove("slide-div-active2");
    slideDiv3.classList.remove("slide-div-active3");
    slideDiv4.classList.toggle("slide-div-active4");
    slideDiv5.classList.remove("slide-div-active5");
});
slideDivH1Five.addEventListener("click", () => {
    slideDiv1.classList.remove("slide-div-active1");
    slideDiv2.classList.remove("slide-div-active2");
    slideDiv3.classList.remove("slide-div-active3");
    slideDiv4.classList.remove("slide-div-active4");
    slideDiv5.classList.toggle("slide-div-active5");
});
