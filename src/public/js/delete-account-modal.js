const btnDeleteAccount = $('.btn-delete-account');
const deleteAccountModal = $('.delete-account.modal');
const cancelDeleteAccount = $('.delete-account .cancel');
const deleteAccount = $('.delete-account .delete');
const formDeleteAccount = $('.delete-account form');

/**
 * Show modal delete account.
 */
if (btnDeleteAccount) {
    btnDeleteAccount.onclick = function () {
        deleteAccountModal.style.display = 'inline-block';
    }
}

/**
 * Cancel delete account.
 */
if (cancelDeleteAccount) {
    cancelDeleteAccount.onclick = function () {
        deleteAccountModal.style.display = 'none';
    }
}

/**
 * Delete account
 */
if (deleteAccount) {
    deleteAccount.onclick = function () {
        if (window.confirm('Are you sure you want to delete this account')) {
            formDeleteAccount.submit();
        }
    }
}