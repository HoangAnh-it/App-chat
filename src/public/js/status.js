const directTo = $('.comeTo a');
const btnComeTo = $('.btn.comeTo');

directTo.onclick = function (event) {
    event.preventDefault();
}

btnComeTo.onclick = function () {
    if (directTo.href.split('/').at(-1) === 'back') {
        while (document.referrer === window.location.href) {
            browser.history.deleteUrl(document.referrer);
        }
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