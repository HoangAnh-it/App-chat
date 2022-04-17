const btnPrivacy = $('.options .privacy');
const btnSettings = $('.options .settings');
const optionsPrivacy = $('.options-privacy');
const optionsSetting = $('.options-settings');
const inputs = $$('.options-privacy input');
const formAvatar = $('form.formAvatar');
const avatar = $('.img-avatar');
const inputAvatar = $('input#input-avatar');
const btnAddFriend = $('.profile-actions .add-friend');
const btnCancelRequest = $('.profile-actions .cancel-request');
const btnResponseRequest = $('.profile-actions .respond-request');
const btnFriend = $('.profile-actions .friend');
const btnUnfriend = $('.profile-actions .friend .unfriend');
const confirmRequest = $('.answer .confirm');
const deleteRequest = $('.answer .delete');
const iconEditInfos = $$('.profile .options-privacy i');
const infoForm = $('.profile form.info');
const btnEditPrivacy = $('.privacy-info .button-edit');
const btnEditPrivacy_update = $('.privacy-info .button-edit .update');
const btnEditPrivacy_cancel = $('.privacy-info .button-edit .cancel');

let originValueInfo = {}
let originAvatar;

/**
 * Show your privacy settings.
 */
btnPrivacy.onclick = function () {
    if (optionsPrivacy.style.display === 'none' || !optionsPrivacy.style.display) {
        btnPrivacy.style.backgroundColor = 'rgb(119, 119, 119)';
        if(btnSettings) btnSettings.style.backgroundColor = '#ccc';
        optionsPrivacy.style.display = 'flex';
        if(optionsSetting) optionsSetting.style.display = 'none';
    }
    else {
        btnPrivacy.style.backgroundColor = '#ccc';
        optionsPrivacy.style.display = 'none';
        
    }
}

/**
 * Show your setting.
 */
if (btnSettings) {
    btnSettings.onclick = function () {
        if (optionsSetting.style.display === 'none' || !optionsSetting.style.display) {
            btnSettings.style.backgroundColor = 'rgb(119, 119, 119)';
            btnPrivacy.style.backgroundColor = '#ccc';
            optionsSetting.style.display = 'block';
            optionsPrivacy.style.display = 'none';
        }
        else {
            btnSettings.style.backgroundColor = '#ccc';
            optionsSetting.style.display = 'none';
        }
    }
}


/**
 * Show form change user's avatar.
 */
function loadAvatar() {
    originAvatar = avatar.src;
    const reader = new FileReader();
    reader.onload = function () {
        avatar.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    $('.btn-edit-avatar .confirm-edit').style.display = 'inline-block';
    $('.btn-edit-avatar .choose-avatar').style.display = 'none';
}

/**
 * When click on Update button. Start updating.
 */
function updateAvatar() {
    $('input.invisibility').value = avatar.src;
    if (window.confirm('Are you sure to update your avatar?')) {
        formAvatar.submit();
    }
}

/**
 * When click on cancel button. Stop updating.
 */
function cancelUpdateAvatar() {
    avatar.src = originAvatar;
    $('.btn-edit-avatar .confirm-edit').style.display = 'none';
    $('.btn-edit-avatar .choose-avatar').style.display = 'inline-block';
    inputAvatar.value = '';
}

/**
 * When click on edit button.
 * Show 2 buttons: Update and Cancel.
 */
for (const iconEdit of iconEditInfos) {
    iconEdit.onclick = function () {
        const field = iconEdit.dataset.for;
        const inputField = $(`.profile .options-privacy .input-${field}`);
        if (!(field in originValueInfo)) {
            originValueInfo[field] = inputField.value.trim();
        }
        inputField.classList.toggle('input-disabled');
        if (!btnEditPrivacy.style.display || btnEditPrivacy.style.display === 'none') {
            btnEditPrivacy.style.display = 'block';
        }
    }

}

/**
 *  Cancel update info of user.
 */
if (btnEditPrivacy_cancel) {
    btnEditPrivacy_cancel.onclick = function () {
        for (const input of inputs) {
            if (input.name in originValueInfo) {
                input.value = originValueInfo[input.name];
            }
            if (!input.classList.contains('input-disabled')) {
                input.classList.add('input-disabled');
            }
        }
        btnEditPrivacy.style.display = 'none';
        originValueInfo = {};
    }
}

/**
 * Update info.
 */
if (btnEditPrivacy_update) {
    btnEditPrivacy_update.onclick = function () {
        if (window.confirm('Are you sure you want to update?')) {
            const differenceFields = [];
            for (const input of inputs) {
                if ( input.name in originValueInfo && input.value.trim() !== originValueInfo[input.name]) {
                    differenceFields.push(input.name);
                }
            }
            console.log(originValueInfo);
            console.log(differenceFields);

            if (differenceFields.length === 0) {
                btnEditPrivacy_cancel.click();
                return;
            }
            for (const input of inputs) {
                if (!differenceFields.includes(input.name)) {
                    input.removeAttribute('name');
                }
            }
            infoForm.submit();
            for (const field of differenceFields) {
                $(`.profile .options-privacy .input-${field}`).name = field;
            }
        }
    }
}

 /**
  * Profile actions.
  * */
if (btnAddFriend) {
    const otherId = $('.profile-actions').dataset.other_id;
    btnAddFriend.onclick = function () {
        axios({
            url: '/api/v2/user/send-friend-request',
            method: 'POST',
            data: {
                otherId,
            }
        }).then(() => {
            window.location.reload();
        })
    }
}

if (btnCancelRequest) {
    const otherId = $('.profile-actions').dataset.other_id;
    btnCancelRequest.onclick = function () {
        console.log('click');
        axios({
            url: '/api/v2/user/cancel-friend-request',
            method: 'POST',
            data: {
                otherId,
            }
        }).then(() => {
            window.location.reload();
        })
    }
}

if (btnFriend) {
    btnFriend.onclick = function () {
        if (btnUnfriend.style.display === '' || btnUnfriend.style.display === 'none') {
            btnUnfriend.style.display = 'inline-block';
        } else {
            btnUnfriend.style.display = 'none';
        }
    }
}

if (btnUnfriend) {
    btnUnfriend.onclick = function () {
        const otherId = $('.profile-actions').dataset.other_id;
        axios.post('/api/v2/user/unfriend', { otherId })
            .then(() => {
                window.location.reload();
            });
    }
}

if (btnResponseRequest) {
    btnResponseRequest.onclick = function () {
        const answer = $('.respond-request .answer');
        if (answer.style.display === '' || answer.style.display === 'none') {
            answer.style.display = 'inline-block';
        } else {
            answer.style.display = 'none';
        }
    }
}

if (confirmRequest) {
    const otherId = $('.profile-actions').dataset.other_id;
    confirmRequest.onclick = function () {
        axios.post('/api/v2/user/confirm-friend-request', { otherId })
            .then(() => {
                window.location.reload();
            });
    }
}

if (deleteRequest) {
    const otherId = $('.profile-actions').dataset.other_id;
    deleteRequest.onclick = function () {
        axios.post('/api/v2/user/delete-friend-request', { otherId })
            .then(() => {
                window.location.reload();
            });
    }
}
