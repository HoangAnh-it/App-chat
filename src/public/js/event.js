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
        `;
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
        const msg = document.createElement('div');
        const nameOfSender = document.createElement('p');
        const msgContent = document.createElement('span');
        const linkToOther = document.createElement('a');

        msg.classList.add('content-other-message');
        nameOfSender.classList.add('name-of-sender');
        
        nameOfSender.textContent = data.senderName;
        msgContent.textContent = data.message;
        linkToOther.href = `/api/v2/user/profile?id=${data.senderId}`;

        linkToOther.innerHTML = 
        `
            <img src=${data.senderAvatar}></img>
        `;
        msg.appendChild(nameOfSender);
        msg.appendChild(msgContent);
        msgContainer.classList.add('other-message', 'flex');
        msgContainer.appendChild(linkToOther);
        msgContainer.appendChild(msg);
    }

    // Add new message into box container
    boxContainer.appendChild(msgContainer);
    autoScroll();
});

socket.on('results of searching', data => {
    resultsOfSearching.innerHTML = ''; // clear loading
    if (data.length > 0) {
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
    } else {
        const div = document.createElement('div');
        div.classList.add('no-results');
        div.textContent = 'No results.';
        resultsOfSearching.appendChild(div);
    }
});

/** send message */
btnSendMessage.onclick = startSendingMessage;
inputMessage.onkeydown = (event) => {
    if (event.keyCode === 13) { // press 'enter' to send message
        startSendingMessage();
    }
}


/**
 * Search
 */

// send keyword
const startSearching = debounce((args) => {
    socket.emit('search-friends', args[0]);
}, 1000);

inputSearch.onblur = () => {
    resultsOfSearching.innerHTML = '';
}

inputSearch.oninput = (event) => {
    const keyword = event.target.value.trim();
    loading();
    startSearching(keyword);
}

function debounce(fnc, wait) {
    let timerId;
    return function() {
        const args = arguments;

        const executeFunction = function () {
            fnc(args);
        }

        if (timerId || args[0] === '') {
            console.log('clear');
            clearTimeout(timerId);
        }

        if (args[0] !== '') {
            timerId = setTimeout(executeFunction, wait);
        }
    }
}

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

/**
 *  send message 
*/
function startSendingMessage() {
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

/**
 *  Auto scroll to bottom of box
 */
function autoScroll() {
    boxContainer.scrollTop = boxContainer.scrollHeight;
}

/**
 *  Loading
 */

function loading() {
    // if the loading is not already, show new one
    if (!document.querySelector('.search .loader')) {
        resultsOfSearching.innerHTML = '';
        const loader = document.createElement('div');
        loader.classList.add('loader');
        resultsOfSearching.appendChild(loader);
    }
}