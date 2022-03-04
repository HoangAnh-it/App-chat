const socket = io();
socket.on('connect', () => {
    console.log('A user connected');
});

const inputMessage = document.querySelector('.input-new-message');
const btnSend = document.querySelector('.btn-send-message');
const msgContainer = document.querySelector('.msg-container');

btnSend.onclick = (e) => {
    e.preventDefault();
    const newMsg = inputMessage.value;
    inputMessage.value = '';
    if(newMsg) {
        const data = {
            message: newMsg,
            sender: {
                name: btnSend.dataset.sender_name,
                avatar: btnSend.dataset.sender_avatar,
            }
        }
        createNewMessage(data, true);
        socket.emit('send-message', data);
    }
}

socket.on('new-message', data => {
    createNewMessage(data, false);
});

function createNewMessage(data, isSelf = false) {
    const newDiv = document.createElement('div');
    newDiv.classList.add('message');

    if(isSelf) {
        newDiv.innerHTML = 
        `
                <span class="message-content">
                    ${data.message}
                </span>
        `;
        newDiv.classList.add('self');
    } else {
        newDiv.innerHTML = 
        `
            <img src="${data.sender.avatar}" alt="..."></img>
            <div class="content">
                <p class="sender-name">${data.sender.name}</p>
                <span class="message-content">
                    ${data.message}
                </span>
            </div>
        `;
        newDiv.classList.add('others');
    }
    msgContainer.appendChild(newDiv);
}

// --------------------Room management-----------------------------

const roomAction = document.querySelector('.room-management .options');
const inputRoomAction = document.querySelector('.input-room-action');
const btnSubmitRoomAction = document.querySelector('.btn-submit-room-action');

roomAction.onchange = function() {
    switch(this.value) {
        case 'create':
            inputRoomAction.classList.remove('invisible');
            inputRoomAction.placeholder = 'Enter name of room';
            break;
            
            case 'join':
                inputRoomAction.classList.remove('invisible');
                inputRoomAction.placeholder = 'Enter ID of room';
            break;

        default: 
            inputRoomAction.classList.add('invisible');
            btnSubmitRoomAction.classList.add('disabled');
            break;
        }
        
    }
    
inputRoomAction.oninput = function () {
    console.log(this.value);
    if (this.value) {
        btnSubmitRoomAction.classList.remove('disabled');
    } else {
        btnSubmitRoomAction.classList.add('disabled');
    }
}
