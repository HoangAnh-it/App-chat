const btnChatBox = $('.nav .nav__chat');
const btnAllUsers = $('.nav .nav__all-users');
const btnFriends = $('.nav .nav__friends');

btnChatBox.onclick = function () {
    window.location.href = '/api/v2/chat';
}

btnAllUsers.onclick = function () {
    window.location.href = '/api/v2/all-users?page=1'
}

btnFriends.onclick = function () {
    window.location.href = '#';
}