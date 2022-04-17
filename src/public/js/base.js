const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const userId = $('.client-id')?.dataset.user_id;
console.log('Your id =>', userId);

const btnBack = $('.btn-back');
if (btnBack) {
    btnBack.onclick = function () {
        history.back();
    }    
}

function debounce(fnc, wait) {
    let timerId;
    return function () {
        const args = arguments;
        const executeFunction = function () {
            fnc(args[0]);
        }

        if (timerId) {
            clearTimeout(timerId);
        }

        if (args[0] !== '') {
            timerId = setTimeout(executeFunction, wait);
        }
    }
}