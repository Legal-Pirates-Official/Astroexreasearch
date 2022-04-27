var modal = document.querySelectorAll(".myModal");
var img = document.querySelectorAll(".myImg");
var modalImg = document.querySelectorAll(".img01");
var captionText = document.querySelectorAll(".caption");

img.forEach((element) => {
    element.onclick = function () {
        modal.forEach((e) => {
            e.style.display = "block";
        });
    };
});

// img.onclick = function () {
//     modal.style.display = "block";
// };

var span = document.querySelectorAll(".close");

span.forEach((element) => {
    element.onclick = function () {
        modal.forEach((e) => {
            e.style.display = "none";
        });
    };
});

// span.onclick = function () {
//     modal.style.display = "none";
// };
