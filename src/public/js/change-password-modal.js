const changePasswordModal = $('.change-password.modal');
const formChangePassword = $('.change-password-form');
const updatePassword = $('.change-password-form .update');
const cancelChangePassword = $('.change-password-form .cancel');
const btnShowChangePasswordForm = $('.btn-open-change-password-form');

if (btnShowChangePasswordForm) {
    btnShowChangePasswordForm.onclick = () => {
        changePasswordModal.style.display = 'inline-block';
    }
}

/**
 * Update password.
 */
if (updatePassword) {
    updatePassword.onclick = function () {
        if (window.confirm('Are you sure you want to update your password?')) {
            formChangePassword.submit();
        }
    }
}

/**
 * Stop changing password.
 */
if (cancelChangePassword) {
    cancelChangePassword.onclick = function () {
        changePasswordModal.style.display = 'none';
    }
}
