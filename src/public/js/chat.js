const formRoomEvent = document.querySelector('.room-event');
const inputRoomEvent = document.querySelector('.room-event input');
const btnCreateRoom = document.querySelector('.btn.create');
const btnJoinRoom = document.querySelector('.btn.join');
const btnSubmit = document.querySelector('.room-event .submit');
const btnCancel = document.querySelector('.room-event .cancel');
const btnSelectMaxUser = document.querySelector('.room-event select.max-users');
const btnEditRooms = document.querySelectorAll('.list .item .btn-more');

let typeOfSubmit = undefined;

btnCreateRoom.onclick = function() {
    formRoomEvent.style.display = 'flex';
    inputRoomEvent.placeholder = 'Enter the name of group';
    this.style.opacity = 0.5;
    btnJoinRoom.style.opacity = 1;
    typeOfSubmit = 'create-room';
    btnSelectMaxUser.style.display = 'inline-block';
}

btnJoinRoom.onclick = function () {
    formRoomEvent.style.display = 'flex';
    inputRoomEvent.placeholder = 'Enter the ID of group';
    this.style.opacity = 0.5;
    btnCreateRoom.style.opacity = 1;
    typeOfSubmit = 'join-room';
    btnSelectMaxUser.style.display = 'none';
}

btnCancel.onclick = function () {
    inputRoomEvent.value = '';
    formRoomEvent.style.display = 'none';
    btnJoinRoom.style.opacity = 1;
    btnCreateRoom.style.opacity = 1;
    typeOfSubmit = undefined;
    btnSelectMaxUser.value = 'none';
    btnSelectMaxUser.style.display = 'none';
}

btnSubmit.onclick = function () {
    formRoomEvent.action = `/api/v2/room/event?type=${typeOfSubmit}`;
    formRoomEvent.submit();
}

inputRoomEvent.oninput = function () {
    if ((this.value && btnSelectMaxUser.style.display !== 'none' && btnSelectMaxUser.value !== 'none')
        || (this.value && btnSelectMaxUser.style.display === 'none')) {
        btnSubmit.classList.remove('disabled');
    } else {
        btnSubmit.classList.add('disabled');
    }
}

btnSelectMaxUser.onchange = function () {
    if (this.value === 'none' || !inputRoomEvent.value) {
        btnSubmit.classList.add('disabled');
    } else {
        btnSubmit.classList.remove('disabled');
    }
}

// submit create or join room
btnSubmit.onclick = function () {
    if (btnSubmit.classList.contains('disabled')) {
        return;
    }
    formRoomEvent.action = `/api/v2/user/${typeOfSubmit}`;
    formRoomEvent.submit();
}

// edit each of rooms
for (const btn of btnEditRooms) {
    btn.onclick = function (e) {
        const btnMore = e.target.closest('.btn-more');
        const roomId = btnMore.dataset.roomid;
        if (btnMore) {
            if (btnMore.classList.contains('ti-arrow-left')) {
                btnMore.classList.remove('ti-arrow-left');
                btnMore.classList.add('ti-arrow-right');
                document.querySelector(`.list .item .options-${roomId}`).style.display = 'inline-block';
            } else {
                btnMore.classList.add('ti-arrow-left');
                btnMore.classList.remove('ti-arrow-right');
                document.querySelector(`.list .item .options-${roomId}`).style.display = 'none';
            }
        }
    }
}
