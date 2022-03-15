const btnComeTo = document.querySelector('.btn.comeTo');
const directTo = document.querySelector('.comeTo a');
btnComeTo.onclick = function () {
    if (directTo.href) {
        window.location.href = directTo.href;
    } 
}