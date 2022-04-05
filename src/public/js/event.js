const rooms = document.querySelectorAll('.list-rooms .items .item');
const chattingWith = document.querySelector('.chat-box .chatting-with');
const messageController = document.querySelector('.input-message');
const inputMessage = document.querySelector('.input-message .message');
const btnSendMessage = document.querySelector('.btn-send-message');
const boxContainer = document.querySelector('.chat-box .box');
const inputSearch = document.querySelector('.search input');
const btnSearch = document.querySelector('.btn-search');
const resultsOfSearching = document.querySelector('.search .results');

const clientId = Number.parseInt(document.querySelector('.client-id').dataset.client_id);
console.log('Your id =>', clientId);
let type; // room or private or none
let partnerId;

const socket = io();
socket.on('connect', () => {
    console.log('AN USER CONNECTED', socket.id);
});

// Start chatting
for (const room of rooms) {
    room.onclick = function (e) {
        const clickOn = e.target.closest('.list-rooms .item .room-name');
        if (clickOn) {
            const roomId = clickOn.dataset.roomid;
            socket.emit('open-room', roomId);
            // show message controller;
            messageController.style.visibility = 'visible';
        }

    }
}

socket.on('info-partner', partner => {
    type = partner.type;
    partnerId = partner.id;
    // set partner in chatting-with
    chattingWith.innerHTML =
        `
            <img class="partner-avatar" src="${partner.avatar}" alt="Cannot load avatar of group"></img>
            <div class="partner-name">${partner.name}</div>
            <div class="btn-leave-chatting ti-close" data-partnerinfo='{"type":"${partner.type}", "id":${partner.id}}' onclick="endChatting()"></div>
        `
});

socket.on('receive-message', data => {
    console.log('receive message', data);
    const isSelf = data.senderId === clientId;
    const msgContainer = document.createElement('div'); // contain the content of the message
    if (isSelf) {
        // if this message is yours
        const span = document.createElement('span');
        span.textContent = data.message;
        msgContainer.classList.add('your-message');
        msgContainer.appendChild(span);
    } else {
        // if this message is not yours
        const img = document.createElement('img');
        const span = document.createElement('span');
        img.src = data.senderAvatar;
        span.textContent = data.message;
        msgContainer.classList.add('other-message', 'flex');
        msgContainer.appendChild(img);
        msgContainer.appendChild(span);
    }

    // Add new message into box container
    boxContainer.appendChild(msgContainer);
    autoScroll();
});

socket.on('results of searching', data => {
    if (data.length > 0) {
        resultsOfSearching.innerHTML = '';
        for (const user of data) {
            const div = document.createElement('div');
            const img = document.createElement('img');
            const a = document.createElement('a');

            div.classList.add('result-item', 'flex')
            img.src = user.userAvatar;
            a.textContent = user.userName;
            a.href = `/api/v2/user/profile/?id=${user.userId}`;
            div.appendChild(img);
            div.appendChild(a);

            resultsOfSearching.appendChild(div);
        }
    }
});

// End chatting
function endChatting () {
    const partner = JSON.parse(document.querySelector('.btn-leave-chatting').dataset.partnerinfo);
    socket.emit('end-chatting', {
        type: partner.type,
        id: partner.id,
    });
    type = 'none';
    // clear all message
    chattingWith.innerHTML = '';
    messageController.style.visibility = 'hidden';
    boxContainer.innerHTML = '';
}

// send message
btnSendMessage.onclick = function () {
    const message = inputMessage.value;
    if (message) {
        inputMessage.value = '';
        const data = {
            partnerId: partnerId,
            senderId: btnSendMessage.dataset.sender_id,
            message: message,
            type: type,
        }
        socket.emit('send-message', data);
    }
}

function autoScroll() {
    boxContainer.scrollTop = boxContainer.scrollHeight;
}

/**
 * Search
 */

// send keyword
inputSearch.oninput = function () {
    const keyword = inputSearch.value;
    if (keyword) {
        socket.emit('search-friends', keyword.toLowerCase());
    } else {
        resultsOfSearching.innerHTML = '';
    }
}
