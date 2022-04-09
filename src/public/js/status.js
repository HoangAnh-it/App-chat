const btnComeTo = $('.btn.comeTo');
const directTo = $('.comeTo a');
btnComeTo.onclick = function () {
    if (directTo.href) {
        window.location.href = directTo.href;
    } 
}
