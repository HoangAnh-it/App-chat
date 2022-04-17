const formRoomEvent = $('.room-event');
const inputRoomEvent = $('.room-event input');
const btnSelectMaxUser = $('.room-event select.max-users');
const btnCreateRoom = $('.btn.create');
const btnJoinRoom = $('.btn.join');
const btnSubmit = $('.room-event .submit');
const btnCancel = $('.room-event .cancel');
const btnEditRooms = $$('.list .item .btn-more');
const searchArea = $('.search');
const profileLink = $('header .more .profile a');
const btnShareLinks = $$('.share-link-room i');
const btnSeeAllUsers = $('.search .see-all-users');
const btnSeeInfoRooms = $$('.edit-room i');
////// search
const inputSearch = $('.search input');
const btnSearch = $('.btn-search');
const resultsOfSearching = $('.search .results');

const btnLeavingRooms = $$('.list-rooms .item a.delete-room i');

let typeOfSubmit = undefined;

/**
 * Show form create room.
 */
btnCreateRoom.onclick = function() {
    formRoomEvent.style.display = 'flex';
    inputRoomEvent.placeholder = 'Enter the name of group';
    this.style.opacity = 0.5;
    btnJoinRoom.style.opacity = 1;
    typeOfSubmit = 'create';
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
    typeOfSubmit = 'join';
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
    btnSubmit.classList.add('disabled');
    typeOfSubmit = undefined;
    btnSelectMaxUser.value = 'none';
    btnSelectMaxUser.style.display = 'none';
}

/**
 *  Validate room actions.
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
    formRoomEvent.action = `/api/v2/room/${typeOfSubmit}`;
    formRoomEvent.submit();
    // const payload = {};
    // payload.roomInfoInput = inputRoomEvent.value.trim();
    // if (typeOfSubmit === 'create') {
    //     payload.maxUsers = btnSelectMaxUser.value;
    // }
    // axios.post(`/api/v2/room/${typeOfSubmit}`, payload)
    //     .then(res => {
    //         if (res.statusText === 'OK') {
    //             // const data = res.data;
    //             // addRoomIntoDOM(data);
    //             window.location.reload();
    //         }
    //     })
    //     .catch(console.error);

}

function addRoomIntoDOM(data) {
    // const html = `
    //     <div class="room-name" data-roomid=${data.id}>"${data.name}"</div>
    //     <i class="fas fa-arrow-left btn-more" data-roomid=${data.id}></i>
    //     <div class="options options-${data.id} flex">
        
    //         <a class="edit-room" href="/api/v2/room?id=${data.id}">
    //             <i class="fas fa-pencil-alt"></i>
    //         </a>
    //         <a class="delete-room">
    //             <i class="fas fa-trash-alt" data-id="${data.id}"></i>
    //         </a>
    //         <a class="share-link-room">
    //             <i class="fas fa-share" data-room='{"roomId":"${data.id}", "roomName":"${data.name}"}''></i>
    //         </a>
    //     </div>
    // `;

    // const room = document.createElement('div');
    // room.classList.add('item', `room-${data.id}`, 'flex');
    // room.innerText = html;
    // $('.list-rooms .items').appendChild(room);

    // return; 

    room = document.createElement('div');
    room.className = `item room-${data.id} flex`;

    const name = document.createElement('div');
    name.className = `room-name data-roomid=${data.id}`;
    name.textContent = data.name

    const iconLeft = document.createElement('i');
    iconLeft.className = `fas fa-arrow-left btn-more`;
    iconLeft.dataset.roomid = data.id;

    const options = document.createElement('div');
    options.className = 'options options-${data.id} flex';

    const editRoom = document.createElement('a');
    editRoom.href = `/api/v2/room?id=${data.id}`;
    editRoom.innerHTML = '<i class="fas fa-pencil-alt"></i>';

    const deleteRoom = document.createElement('a');
    const deleteRoom_i = document.createElement('i');
    deleteRoom_i.className = 'fas fa-trash-alt';
    deleteRoom_i.dataset.id = data.id;
    deleteRoom.appendChild(deleteRoom_i);

    const shareLinkRoom = document.createElement('a');
    const shareLinkRoom_i = document.createElement('i');
    shareLinkRoom_i.className= 'fas fa-share';
    shareLinkRoom_i.dataset.room = `{"roomId":"${data.id}", "roomName":"${data.name}"}`;
    shareLinkRoom.appendChild(shareLinkRoom_i);

    room.appendChild(name);
    room.appendChild(iconLeft);
    room.appendChild(options);
    room.appendChild(editRoom);
    room.appendChild(deleteRoom);
    room.appendChild(shareLinkRoom);

    $('.list-rooms .items').appendChild(room);
}

/**
 * Leaving room.
 */
for (const btnLeavingRoom of btnLeavingRooms) {
    btnLeavingRoom.onclick = function (event) {
        const roomId = this.dataset.id;
        axios.delete(`/api/v2/room/leave?roomId=${roomId}`)
            .then(res => {
                if (res.statusText === 'OK') {
                    removeRoomFromDOM(roomId);
                } else {
                        // DO ST
            
                    }
                })
                .catch(console.error);
    }
}

function removeRoomFromDOM(roomId) {
    $(`.list-rooms .room-${roomId}`).remove();
}

/**
 *  Edit each of rooms.[delete, ...]
 */
for (const btn of btnEditRooms) {
    btn.onclick = function (e) {
        const btnMore = e.target.closest('.btn-more');
        const roomId = btnMore.dataset.roomid;
        if (btnMore) {
            if (btnMore.classList.contains('fa-arrow-left')) {
                btnMore.classList.remove('fa-arrow-left');
                btnMore.classList.add('fa-arrow-right');
                $(`.list .item .options-${roomId}`).style.display = 'inline-block';
            } else {
                btnMore.classList.add('fa-arrow-left');
                btnMore.classList.remove('fa-arrow-right');
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

/**
 * Get ID of room
 */
for (const btnShare of btnShareLinks) {
    btnShare.onclick = function () {
        const { roomId, roomName } = JSON.parse(btnShare.dataset.room);
        $('.modal.link-room .name').textContent = roomName;
        $('.modal.link-room .link').value = roomId;
        $('.modal.link-room').style.display = 'inline-block';
    }
}

/**
 * See all users.
 */
btnSeeAllUsers.onclick = function () {
    window.location.href = '/api/v2/all-users?page=1';
}

/**
 * Search users.
 */
const startSearching = debounce((keyword) => {
    axios.get(`/api/v2/search-user?keyword=${keyword}`)
        .then(res => {
            const data = res.data;
            showResultsOfSearching(data);
        })
        .catch(console.error);
}, 1000);

inputSearch.oninput = (event) => {
    const keyword = event.target.value.trim();
    loading();
    if (!keyword)
        resultsOfSearching.innerHTML = '';

    startSearching(keyword);
}

function showResultsOfSearching(data) {
    resultsOfSearching.innerHTML = ''; // clear loading
    if (data.length > 0) {
        // Show all user found.
        for (const user of data) {
            const div = document.createElement('div');
            const img = document.createElement('img');
            const p = document.createElement('p');

            div.classList.add('result-item', 'flex')
            img.src = user.userAvatar;
            p.textContent = user.userName;
            div.onclick = () => {
                window.location.href = `/api/v2/user/profile?id=${user.userId}`;
            };
            div.appendChild(img);
            div.appendChild(p);

            resultsOfSearching.appendChild(div);
        }
    } else {
        const div = document.createElement('div');
        div.classList.add('no-results');
        div.textContent = 'No results.';
        resultsOfSearching.appendChild(div);
    }
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

