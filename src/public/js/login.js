const logInForm = $('.login-form');
const btnLogin = $('.btn.login-submit');
const btnLoginGoogle = $('.btn-login-with-google');

btnLogin.onclick = function () {
    logInForm.submit();
}

btnLoginGoogle.onclick = function () {
    $('.btn-login-with-google a').click();
}
