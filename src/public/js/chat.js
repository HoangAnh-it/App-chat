const formRoomEvent = $('.room-event');
const inputRoomEvent = $('.room-event input');
const btnCreateRoom = $('.btn.create');
const btnJoinRoom = $('.btn.join');
const btnSubmit = $('.room-event .submit');
const btnCancel = $('.room-event .cancel');
const btnSelectMaxUser = $('.room-event select.max-users');
const btnEditRooms = $$('.list .item .btn-more');
const searchArea = $('.search');
const profileLink = $('header .more .profile a');

let typeOfSubmit = undefined;

/**
 * Show form create room.
 */
btnCreateRoom.onclick = function() {
    formRoomEvent.style.display = 'flex';
    inputRoomEvent.placeholder = 'Enter the name of group';
    this.style.opacity = 0.5;
    btnJoinRoom.style.opacity = 1;
    typeOfSubmit = 'create-room';
    btnSelectMaxUser.style.display = 'inline-block';
}

/**
 * Show form join room.
 */
btnJoinRoom.onclick = function () {
    formRoomEvent.style.display = 'flex';
    inputRoomEvent.placeholder = 'Enter the ID of group';
    this.style.opacity = 0.5;
    btnCreateRoom.style.opacity = 1;
    typeOfSubmit = 'join-room';
    btnSelectMaxUser.style.display = 'none';
}

/**
 *  Hide form create or join room.
 */
btnCancel.onclick = function () {
    inputRoomEvent.value = '';
    formRoomEvent.style.display = 'none';
    btnJoinRoom.style.opacity = 1;
    btnCreateRoom.style.opacity = 1;
    typeOfSubmit = undefined;
    btnSelectMaxUser.value = 'none';
    btnSelectMaxUser.style.display = 'none';
}

/**
 * Start creating or joining room.
 */
btnSubmit.onclick = function () {
    formRoomEvent.action = `/api/v2/room/event?type=${typeOfSubmit}`;
    formRoomEvent.submit();
}

/**
 *  Validate.
 */
inputRoomEvent.oninput = function () {
    if ((this.value.trim() && btnSelectMaxUser.style.display !== 'none' && btnSelectMaxUser.value !== 'none')
        || (this.value.trim() && btnSelectMaxUser.style.display === 'none')) {
        btnSubmit.classList.remove('disabled');
    } else {
        btnSubmit.classList.add('disabled');
    }
}

btnSelectMaxUser.onchange = function () {
    if (this.value === 'none' || !inputRoomEvent.value.trim()) {
        btnSubmit.classList.add('disabled');
    } else {
        btnSubmit.classList.remove('disabled');
    }
}

/**
 * Submit create or join room.
 */
btnSubmit.onclick = function () {
    if (btnSubmit.classList.contains('disabled')) {
        return;
    }
    inputRoomEvent.value = inputRoomEvent.value.trim();
    formRoomEvent.action = `/api/v2/user/${typeOfSubmit}`;
    formRoomEvent.submit();
}

/**
 *  Edit each of rooms.[delete, ...]
 */
for (const btn of btnEditRooms) {
    btn.onclick = function (e) {
        const btnMore = e.target.closest('.btn-more');
        const roomId = btnMore.dataset.roomid;
        if (btnMore) {
            if (btnMore.classList.contains('ti-arrow-left')) {
                btnMore.classList.remove('ti-arrow-left');
                btnMore.classList.add('ti-arrow-right');
                $(`.list .item .options-${roomId}`).style.display = 'inline-block';
            } else {
                btnMore.classList.add('ti-arrow-left');
                btnMore.classList.remove('ti-arrow-right');
                $(`.list .item .options-${roomId}`).style.display = 'none';
            }
        }
    }
}

/**
 * Click outside Search area.
 * if click outside, this area will be hidden
 * else keep showing.
 */
document.addEventListener('click', event => {
    const isClickInsideElement = searchArea.contains(event.target);
    if (!isClickInsideElement) {
        resultsOfSearching.innerHTML = '';
    }
});
