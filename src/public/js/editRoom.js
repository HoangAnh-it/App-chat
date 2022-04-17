const formEditRoom = $('form.form-edit-room');
const iconEdits = $$('.edit-info .icon-edit');
const avatarGroup = $('.form-edit-room .form-update-avatar img');
const formUpdateAvatarGroup = $('form.form-update-avatar');
const inputNewAvatar = $('input.new-avatar');
const updateChangeAvatarGroup = $('.change-avatar-group .btn-update');
const cancelChangeAvatarGroup = $('.change-avatar-group .btn-cancel');

const formChangeInfo = $('form.change-general-info');
const btnChangeInfo = $('.detail-info .btn-update-info');
const btnUpdateInfo = $('.detail-info .btn-update-info .btn-update');
const btnCancelInfo = $('.detail-info .btn-update-info .btn-cancel');

const members = $$('.list-members .item');

const more = $('.list-members .more');
const optionsRemoveMembers = $$('.list-members .more .remove');

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
    console.log(originInfo);
    btnUpdateInfo.onclick = function () {
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
        formUpdateAvatarGroup.submit();
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
 * Options in list members
 */
for (const optionsRemove of optionsRemoveMembers) {
    optionsRemove.onclick = function () {

    }
}

