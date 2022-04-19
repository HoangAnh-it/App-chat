const rooms = $$('.list-rooms .items .item');
const friends = $$('.list-friends .items .item');
const chattingWith = $('.chat-box .chatting-with');
const messageController = $('.input-message');
const inputMessage = $('.input-message .message');
const btnSendMessage = $('.btn-send-message');
const boxContainer = $('.chat-box .box');
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
        if (currentPartner === btn.dataset.id) {
            endChatting();
        }
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
    const img = document.createElement('img');
    img.classList.add('partner-avatar');
    img.src = partner.avatar;
    img.alt = 'Cannot load avatar of group';
    img.onclick = function () {
        console.log(type, partnerId);
        if (type === 'private') {
            window.location.href = `/api/v2/user/profile?id=${partner.friendId}`;
        } else if (type === 'room') {
            window.location.href = `/api/v2/room?id=${partnerId}`;
        }
    }

    const name = document.createElement('div');
    name.classList.add('partner-name');
    name.textContent = partner.name;

    const btnCallVideo = document.createElement('div');
    btnCallVideo.className = 'btn-call-video fas fa-video';
    btnCallVideo.dataset = `${partner.id}`;

    const btnCallPhone = document.createElement('div');
    btnCallPhone.className = 'btn-call-phone fas fa-phone';
    btnCallPhone.dataset = `${partner.id}`;

    const btnLeaving = document.createElement('div');
    btnLeaving.className = 'btn-leave-chatting 	fas fa-times';
    btnLeaving.dataset.partnerinfo = `{"type":"${partner.type}", "id":"${partner.id}"}`;
    btnLeaving.onclick = endChatting;

    chattingWith.appendChild(img);
    chattingWith.appendChild(name);
    chattingWith.appendChild(btnCallPhone);
    chattingWith.appendChild(btnCallVideo);
    chattingWith.appendChild(btnLeaving);
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
 * End chatting.
 * Clear everything in chat box.
 */
function endChatting() {
    // if you are chatting
    if ($('.btn-leave-chatting')) {
        
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
