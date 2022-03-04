const inputs = document.getElementsByClassName('detail-info');
const userAvatar = document.querySelector('.profile-avatar img');
const firstValues = {};

function editing(userId) {
    for(const input of inputs) {
        firstValues[input.name] = input.value;
        input.classList.remove('input-disabled');
    }
    document.querySelector('.btn-control').innerHTML =
        `
            <div class="btn btn-update" onclick="update()">Update</div>
            <div class="btn btn-cancel" onclick="cancel('${userId}')">Cancel</div>
        `
}

function update(){
    if(window.confirm('Are you sure to update Profile?'))
        document.querySelector('.form-update-info').submit();
}

function cancel(userId) {
    for(const input of inputs) {
        input.value =  firstValues[input.name];
        input.classList.add('input-disabled');
    }
    document.querySelector('.btn-control').innerHTML = `<div class="btn btn-update" onclick="editing('${userId}')">Edit</div>`
}

function editAvatar(userId) {
    const btnChangeAvatar = document.querySelector('input#change-avatar');
    if(userAvatar) {
        const originalAvatar = userAvatar.src;
        if(btnChangeAvatar.files && btnChangeAvatar.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                userAvatar.src = e.target.result;
                document.querySelector('.new-avatar').value = userAvatar.src;
            }
            reader.readAsDataURL(btnChangeAvatar.files[0]);
            document.querySelector('.edit-avatar').innerHTML = 
            `
                <input class="new-avatar invisible" name="avatar" value="">
                <div class="btn btn-update-avatar" onclick="updateAvatar()">Update</div>
                <div class="btn btn-cancel-edit-avatar" onclick="cancelUpdateAvatar('${userId}', '${originalAvatar}')">Cancel</div>
            `
        } else {
            window.alert('Could not upload image!')
        }
    }
}

function updateAvatar() {
    if(window.confirm('Are you sure to update your avatar?')) {
        document.querySelector('form.edit-avatar').submit();
    }
}

function cancelUpdateAvatar(userId, originalAvatar) {
    userAvatar.src = originalAvatar;
    document.querySelector('.edit-avatar').innerHTML = 
    `
        <label class="btn btn-edit-avatar" for="change-avatar">Change</label>
        <input type="file" id="change-avatar" onchange="editAvatar('${userId}')">
    `
}