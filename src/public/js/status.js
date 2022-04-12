const btnComeTo = $('.btn.comeTo');
const directTo = $('.comeTo a');
btnComeTo.onclick = function () {
    if (directTo.href) {
        window.location.href = directTo.href;
    } 
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
        btnComeTo.onclick();
    }
})