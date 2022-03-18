const btnPrivacy = document.querySelector('.options .privacy');
const btnSettings = document.querySelector('.options .settings');
const optionsPrivacy = document.querySelector('.options-privacy');
const optionsSetting = document.querySelector('.options-settings');
const button = document.querySelector('.button');
const btnEdit = document.querySelector('.btn-edit');
const inputs = document.querySelectorAll('.wrapper-options input');
const formInfo = document.querySelector('form.info');
const btnEditAvatar = document.querySelector('.btn-edit-avatar');
const btnChangeAvatar = document.querySelector('.icon-change-avatar');
const formAvatar = document.querySelector('.formAvatar');
const originValue = {}
let originAvatar;

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


// change avatar button
const avatar = document.querySelector('.img-avatar');
const inputAvatar = document.getElementById('input-avatar');

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


// handle event

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

function update(type) {
    switch (type) {
        case 'avatar':
            document.querySelector('input.invisibility').value = avatar.src;
            formAvatar.submit();
            break;
        
        case 'info':
            formInfo.submit();
            break;
        
        default: break;
    }
}

function cancel(type) {

    switch (type) {
        case 'avatar':
            avatar.src = originAvatar;
            btnEditAvatar.classList.remove('btn-edit-avatar');
            btnEditAvatar.innerHTML = `
                <label for="input-avatar"><i class="ti-gallery icon-change-avatar"></i></label>
                <input id="input-avatar" type="file" accept="image/*" name="newAvatar" onchange="loadAvatar()">
            `;
            break;
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

