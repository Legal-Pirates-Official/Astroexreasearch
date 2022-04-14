const slideDiv1 = document.querySelector(".slide-div1");
const slideDiv2 = document.querySelector(".slide-div2");

const slideDivH1One = document.querySelector(".slide-div-h1-one");
const slideDivH1Two = document.querySelector(".slide-div-h1-two");



slideDivH1One.addEventListener("click", () => {
    slideDiv1.classList.toggle("slide-div-active");
});