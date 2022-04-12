const logInForm = $('.login-form');
const btnLogin = $('.btn.login-submit');
const btnLoginGoogle = $('.btn-login-with-google');
const form = $('form');
const inputs = $$('input');

btnLogin.onclick = function () {
    logInForm.submit();
}

btnLoginGoogle.onclick = function () {
    $('.btn-login-with-google a').click();
}

for (const input of inputs) {
    input.onkeydown = function (e) {
        if (e.keyCode === 13) {
            form.submit()
        }
    }
}