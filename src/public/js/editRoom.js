const iconEdits = $$('.edit-info .icon-edit');
const avatarGroup = $('.form-edit-room .form-update-avatar img');
const formUpdateAvatarGroup = $('form.choose');
const inputNewAvatar = $('input.new-avatar');
const updateChangeAvatarGroup = $('.change-avatar-group .btn-update');
const cancelChangeAvatarGroup = $('.change-avatar-group .btn-cancel');

const formChangeInfo = $('form.change-general-info');
const btnChangeInfo = $('.detail-info .btn-update-info');
const btnUpdateInfo = $('.detail-info .btn-update-info .btn-update');
const btnCancelInfo = $('.detail-info .btn-update-info .btn-cancel');

const members = $$('.list-members .item');
const btnCopyLink = $('.link .copy');

let originAvatar;
let originInfo ={};

/**
 * Change information room
 */
for (const iconEdit of iconEdits) {
    iconEdit.onclick = function () {
        const field = iconEdit.dataset.for;
        const inputField = $(`.room-${field}`);
        if (!(field in originInfo)) {
            originInfo[field] = inputField.value.trim();
        }
        inputField.classList.toggle('input-disabled');
        if (!btnChangeInfo.style.display || btnChangeInfo.style.display == 'none') {
            btnChangeInfo.style.display = 'flex';
        }
    }
}

if (btnCancelInfo) {
    btnCancelInfo.onclick = function () {
        for (const field in originInfo) {
            const input = $(`.room-${field}`);
            input.value = originInfo[field];
            input.classList.add('input-disabled');
        }
        btnChangeInfo.style.display = 'none';
    }
}

if (btnUpdateInfo) {
    btnUpdateInfo.onclick = function () {
        if (window.confirm('Are you sure you want to update information?')) {
            const differenceFields = [];
            for (const field in originInfo) {
                const input = $(`.room-${field}`);
                if (originInfo[field] !== input.value.trim()) {
                    differenceFields.push(field);
                }
            }

            if (differenceFields.length === 0) {
                btnCancelInfo.click();
                return;
            }
        
            formChangeInfo.submit();
        }
    }
}

/**
 * Change avatar group.
 */

function loadAvatarGroup() {
    originAvatar = avatarGroup.src;
    const reader = new FileReader();
    reader.onload = function () {
        avatarGroup.src = reader.result;
        inputNewAvatar.value = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    $('.change-avatar-group .confirm').style.display = 'inline-block';
    $('.change-avatar-group .choose').style.display = 'none';
}

if (updateChangeAvatarGroup) {
    updateChangeAvatarGroup.onclick = function () {
        if (window.confirm('Are you sure you want to update avatar group?')) {
            formUpdateAvatarGroup.submit();
        }
    }
}

if (cancelChangeAvatarGroup) {
    cancelChangeAvatarGroup.onclick = function () {
        avatarGroup.src = originAvatar;
        $('.change-avatar-group .confirm').style.display = 'none';
        $('.change-avatar-group .choose').style.display = 'inline-block';
        $('input#input-change-avatar-group').value = '';
    }
}

/**
 * List members.
 */
// remove user from room.
for (const member of members) {
    member.onclick = function (event) {
        const userId = this.dataset.id;
        const optionRemove = event.target.closest('i.remove');
        if (optionRemove) {
            if (window.confirm('Are you sure you want to remove this user?')) {
                const params = new URLSearchParams(window.location.search);
                const roomId = params.get('id');
                console.log('roomId >>',roomId);
                axios.delete('/api/v2/room/remove-user', {
                    data: {roomId, userId,}
                }).then(res => {
                    if (res.statusText === 'OK') {
                        removeUserFromDOM(userId);
                    }
                }).catch(console.error);
            }
        } else {
            window.location.href = `/api/v2/user/profile?id=${userId}`;
        }
    }
}

function removeUserFromDOM(userId) {
    $(`.item-${userId}`).remove();
}

/**
 * Copy link
 */
btnCopyLink.onclick = function () {
    const input = $('.link input');
    input.select();
    navigator.clipboard.writeText(input.value);
    this.textContent = 'Copied';
    setTimeout(() => {
        this.textContent = 'Copy';
    }, 3000);
}