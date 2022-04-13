const directTo = $('.comeTo a');
const btnComeTo = $('.btn.comeTo');

directTo.onclick = function (event) {
    event.preventDefault();
}

btnComeTo.onclick = function () {
    if (directTo.href.split('/').at(-1) === 'back') {
        history.back();
    } else {
        window.location.href = directTo.href;
    }
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
        btnComeTo.onclick();
    }
})