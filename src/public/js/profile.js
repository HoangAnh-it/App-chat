const btnPrivacy = $('.options .privacy');
const btnSettings = $('.options .settings');
const optionsPrivacy = $('.options-privacy');
const optionsSetting = $('.options-settings');
const button = $('.button');
const btnEdit = $('.btn-edit');
const inputs = $$('.wrapper-options input');
const formInfo = $('form.info');
const btnEditAvatar = $('.btn-edit-avatar');
const btnChangeAvatar = $('.icon-change-avatar');
const formAvatar = $('.formAvatar');
const avatar = $('.img-avatar');
const inputAvatar = document.getElementById('input-avatar');
const btnAddFriend = $('.profile-actions .add-friend');
const btnCancelRequest = $('.profile-actions .cancel-request');
const btnResponseRequest = $('.profile-actions .respond-request');
const confirmRequest = $('.answer .confirm');
const deleteRequest = $('.answer .delete');

const originValue = {}
let originAvatar;

/**
 * Show your privacy settings.
 */
btnPrivacy.onclick = function () {
    if (optionsPrivacy.style.display === 'none' || !optionsPrivacy.style.display) {
        btnPrivacy.style.backgroundColor = 'rgb(119, 119, 119)';
        btnSettings.style.backgroundColor = '#ccc';
        optionsPrivacy.style.display = 'block';
        optionsSetting.style.display = 'none';
    }
    else {
        btnPrivacy.style.backgroundColor = '#ccc';
        optionsPrivacy.style.display = 'none';
        
    }
}

/**
 * Show your setting.
 */
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
    btnEditAvatar.classList.add('btn-edit-avatar');
    btnEditAvatar.innerHTML = `
        <div class="btn btn-update-avatar" onclick="update('avatar')">Update</div>
        <div class="btn btn-cancel-avatar" onclick="cancel('avatar')">Cancel</div>
    `;
}

/**
 * When click on edit button.
 * Show 2 buttons: Update and Cancel.
 */
function editInfo() {
    if (btnEdit) {
        if (inputs) {
            for (const input of inputs) {
                originValue[input.name] = input.value;
                input.classList.remove('input-disabled');
            }
        }
        
        const update = document.createElement('div');
        const cancel = document.createElement('div');
        
        button.innerHTML = `
            <div class="btn btn-update" onclick="update('info')">Update</div>
            <div class="btn btn-cancel" onclick="cancel('info')">Cancel</div>
        `;
        button.appendChild(update);
        button.appendChild(cancel);
    }
}

/**
 * When click on Update button. Start updating.
 */
function update(type) {
    switch (type) {
        case 'avatar':
            $('input.invisibility').value = avatar.src;
            if(window.confirm('Are you sure to update your avatar?'))
            formAvatar.submit();
            break;
            
            case 'info':
            if(window.confirm('Are you sure to update your information?'))
                formInfo.submit();
            break;
        
        default: break;
    }
}

/**
 * When click on cancel button. Stop updating.
 */
function cancel(type) {
    switch (type) {
        case 'avatar': {
            avatar.src = originAvatar;
            btnEditAvatar.classList.remove('btn-edit-avatar');
            btnEditAvatar.innerHTML = `
                <label for="input-avatar"><i class="ti-gallery icon-change-avatar"></i></label>
                <input id="input-avatar" type="file" accept="image/*" name="newAvatar" onchange="loadAvatar()">
            `;
            break;
        }
        case 'info': {
            if (inputs) {
                for (const input of inputs) {
                    input.value = originValue[input.name];
                    input.classList.add('input-disabled');
                };
            }

            button.innerHTML = `
                    <div class="btn btn-edit" onclick="editInfo()">Edit</div>
            `;
        }
            
            break;
    
        default:
            break;
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
