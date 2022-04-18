const btnChatBox = $('.nav .nav__chat');
const btnAllUsers = $('.nav .nav__all-users');
const btnMail = $('.nav .nav__mail');

btnChatBox.onclick = function () {
    window.location.href = '/api/v2/chat';
}

btnAllUsers.onclick = function () {
    window.location.href = '/api/v2/all-users?page=1'
}

btnMail.onclick = function () {
    window.location.href = '#';
}