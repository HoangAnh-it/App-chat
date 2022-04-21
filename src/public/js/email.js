const btnCloseMailBox = $('.email-box .close');
const btnCancelEmail = $('.email-box .btn-cancel-email');
const btnSendEmail = $('.email-box .btn-send-email');
const statusSent = $('.email-box .status');

const userEmail = $('input.user-email');
const password = $('input.passwordEmail');
const recipients = $('.email-box .recipients');
const subject = $('.email-box .subject');
const emailContent = $('.email-box .email-content');
const serviceBtn = $('.type-email select');

btnCloseMailBox.onclick = function () {
    email.style.display = 'none';
}

btnCancelEmail.onclick = function () {
    userEmail.value = '';
    password.value = '';
    recipients.value = '';
    subject.value = '';
    emailContent.value = '';
    serviceBtn.value = '';
    serviceBtn.style.boxShadow = '0 0 10px red';
    serviceBtn.style.border = '1px solid red';
    btnCloseMailBox.click();
}

serviceBtn.onchange = function () {
    if (serviceBtn.value) {
        serviceBtn.style.boxShadow = '0 0 10px green';
        serviceBtn.style.border = '1px solid green';
    }
}

btnSendEmail.onclick = function (e) {
    const _userEmail = userEmail.value.trim();
    const _password = password.value.trim();
    const _recipients = recipients.value.trim();
    const _subject = subject.value.trim();
    const _message = emailContent.value.trim();
    const _service = serviceBtn.value.trim();
    
    if (_userEmail && _password && _recipients && _service) {
        axios.post('/api/v2/user/send-email', {
            userEmail: _userEmail,
            password: _password,
            recipients: _recipients,
            subject: _subject,
            message: _message,
            service: _service
        })
            .then(res => {
                console.log(res);
                if (res.data === 'successful') {
                    statusSent.textContent = 'Sent successfully';
                    statusSent.style.color = 'rgb(139, 255, 139)';
                } else {
                    statusSent.textContent = 'Cannot send';
                    statusSent.style.color = 'red';
                }
                statusSent.style.display = 'inline-block';
                setTimeout(() => {
                    statusSent.style.display = 'none';
                }, 5000);
            }).catch(console.error);
    }
}
