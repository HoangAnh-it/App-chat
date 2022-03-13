const registerForm = document.querySelector('.register-form');
const btnRegister = document.querySelector('.btn.register-submit');

btnRegister.onclick = function () {
    registerForm.submit();
}