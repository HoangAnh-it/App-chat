const registerForm = $('.register-form');
const btnRegister = $('.btn.register-submit');
const btnLoginGoogle = $('.btn-login-with-google');

btnRegister.onclick = function () {
    registerForm.submit();
}

btnLoginGoogle.onclick = function () {
    $('.btn-login-with-google a').click();
}
