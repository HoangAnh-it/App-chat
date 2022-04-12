const registerForm = $('.register-form');
const btnRegister = $('.btn.register-submit');
const btnLoginGoogle = $('.btn-login-with-google');
const inputs = $$('input');
const form = $('form');

btnRegister.onclick = function () {
    registerForm.submit();
}

btnLoginGoogle.onclick = function () {
    $('.btn-login-with-google a').click();
}

for (const input of inputs) {
    input.onkeydown = function (e) {
        if (e.keyCode === 13) {
            form.submit();
        }
    }
}
