const logInForm = document.querySelector('.login-form');
const btnLogin = document.querySelector('.btn.login-submit');
const btnLoginGoogle = document.querySelector('.btn-login-with-google');

btnLogin.onclick = function () {
    logInForm.submit();
}

btnLoginGoogle.onclick = function () {
    document.querySelector('.btn-login-with-google a').click();
}

// function onSignIn(googleUser) {
//     const id_token = googleUser.getAuthResponse().id_token;
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', '/api/v2/auth/google-login');
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.send(JSON.stringify({id_token}));
// }

// function signOut() {
//     const auth2 = gapi.auth2.getAuthInstance();
//     auth2.signOut().then(function () {
//       console.log('User signed out.');
//     });
// } 