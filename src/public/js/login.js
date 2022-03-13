const logInForm = document.querySelector('.login-form');
const btnLogin = document.querySelector('.btn.login-submit');

btnLogin.onclick = function () {
    logInForm.submit();
}