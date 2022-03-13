const btnComeTo = document.querySelector('.btn.comeTo');
const comeTo = document.querySelector('.comeTo a');
btnComeTo.onclick = function () {
    if (comeTo.href) {
        window.location.href = comeTo.href;
    } 
}