const rooms = $$('.list-rooms .items .item');
const friends = $$('.list-friends .items .item');
const chattingWith = $('.chat-box .chatting-with');
const messageController = $('.input-message');
const inputMessage = $('.input-message .message');
const btnSendMessage = $('.btn-send-message');
const boxContainer = $('.chat-box .box');
const inputSearch = $('.search input');
const btnSearch = $('.btn-search');
const resultsOfSearching = $('.search .results');
const btnDeleteRooms = $$('a.delete-room');

let type; // ['room', 'private', 'none']
let partnerId; // chatting with
let currentPartner; // room that you are in now
let socketId;

const socket = io();
socket.on('connect', () => {
    console.log('AN USER CONNECTED', socket.id);
    socketId = socket.id;
});

/**
 * Start chatting when chose room
 */
for (const room of rooms) {
    room.onclick = function (e) {
        const clickOn = e.target.closest('.list-rooms .item .room-name');
        if (clickOn) {
            const roomId = clickOn.dataset.roomid;
            
            if (currentPartner && currentPartner !== roomId) {
                endChatting();
            }

            if (!currentPartner) {
                socket.emit('open-room', {
                    roomId,
                    userId: userId,
                });
                // show message controller;
                messageController.style.visibility = 'visible';
                currentPartner = roomId;
            }
        }
    }
}

/**
 * Start chatting when chose friend
 */
for (const friend of friends) {
    friend.onclick = function (event) {
        const friendId = friend.dataset.friend_id;
        if (currentPartner && currentPartner !== friendId) {
            endChatting();
        }
        if (!currentPartner && currentPartner !== friendId) {
            socket.emit('private', {
                friendId: friendId,
                userId: userId,
            });
            messageController.style.visibility = 'visible';
            currentPartner = friendId;
        }
    }
}

/**
 * When click on button delete room.
 */
for (const btn of btnDeleteRooms) {
    btn.onclick = (e) => {
        endChatting();
    }
}

socket.on('join', userName => {
    // inform an user joined the room
    const noticeOfJoining = document.createElement('div');
    noticeOfJoining.classList.add('notice-of-join-or-leave');
    noticeOfJoining.textContent = `${userName} joined`;
    boxContainer.appendChild(noticeOfJoining);
    autoScroll();
});

socket.on('leave', userName => {
    console.log(userName, ' leave');
    const noticeOfLeaving = document.createElement('div');
    noticeOfLeaving.classList.add('notice-of-join-or-leave');
    noticeOfLeaving.textContent = `${userName} left`;
    boxContainer.appendChild(noticeOfLeaving);
    autoScroll();
})

socket.on('info-partner', partner => {
    type = partner.type;
    partnerId = partner.id;
    // set partner in chatting-with
    chattingWith.innerHTML =
        `
            <img class="partner-avatar" src="${partner.avatar}" alt="Cannot load avatar of group"></img>
            <div class="partner-name">${partner.name}</div>
            <div class="btn-leave-chatting 	fas fa-times" data-partnerinfo='{"type":"${partner.type}", "id":"${partner.id}"}' onclick="endChatting()"></div>
        `;
});

socket.on('receive-message', data => {
    const isSelf = data.senderId === userId;
    const msgContainer = document.createElement('div'); // contain the content of the message
    if (isSelf) {
        // if this message is yours
        const span = document.createElement('span');
        span.textContent = data.message;
        msgContainer.classList.add('your-message');
        msgContainer.appendChild(span);
    } else {
        // if this message is not yours
        const msgContent = document.createElement('span');
        msgContent.textContent = data.message;
        
        const msg = document.createElement('div');
        msg.classList.add('content-other-message');

        if (data.type !== 'private') {
            const nameOfSender = document.createElement('p');
            nameOfSender.classList.add('name-of-sender');
            nameOfSender.textContent = data.senderName;
            msg.appendChild(nameOfSender);
        }
        
        
        const linkToOther = document.createElement('a');
        linkToOther.href = `/api/v2/user/profile?id=${data.senderId}`;
        linkToOther.innerHTML = 
        `
            <img src=${data.senderAvatar}></img>
        `;
        
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
        // Show all user found.
        for (const user of data) {
            const div = document.createElement('div');
            const img = document.createElement('img');
            const a = document.createElement('a');

            div.classList.add('result-item', 'flex')
            img.src = user.userAvatar;
            a.textContent = user.userName;
            a.href = `/api/v2/user/profile?id=${user.userId}`;
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



/** 
 * Send message. 
 */
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

inputSearch.oninput = (event) => {
    const keyword = event.target.value.trim();
    loading();
    if (!keyword)
        resultsOfSearching.innerHTML = '';
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
            clearTimeout(timerId);
        }

        if (args[0] !== '') {
            timerId = setTimeout(executeFunction, wait);
        }
    }
}

/**
 * End chatting.
 * Clear everything in chat box.
 */
function endChatting() {
    const partner = JSON.parse($('.btn-leave-chatting').dataset.partnerinfo);
    socket.emit('end-chatting', {
        type: partner.type,
        partnerId: partner.id,
        userId: userId,
    });
    type = 'none';
    // clear all message
    chattingWith.innerHTML = '';
    messageController.style.visibility = 'hidden';
    boxContainer.innerHTML = '';
    currentPartner = undefined;
}

/**
 *  Send message.
*/
function startSendingMessage() {
    const message = inputMessage.value.trim();
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
 *  Auto scroll to bottom of chat box
 */
function autoScroll() {
    boxContainer.scrollTop = boxContainer.scrollHeight;
}

/**
 *  Show loading.
 */
function loading() {
    // if the loading is not already, show new one
    if (!$('.search .loader')) {
        resultsOfSearching.innerHTML = '';
        const loader = document.createElement('div');
        loader.classList.add('loader');
        resultsOfSearching.appendChild(loader);
    }
}
