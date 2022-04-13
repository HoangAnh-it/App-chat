const btnDeleteAccount = $('.btn-delete-account');
const deleteAccountModal = $('.delete-account.modal');
const cancelDeleteAccount = $('.delete-account .cancel');
const deleteAccount = $('.delete-account .delete');
const formDeleteAccount = $('.delete-account form');

/**
 * Show modal delete account.
 */
btnDeleteAccount.onclick = function () {
    deleteAccountModal.style.display = 'inline-block';
}

/**
 * Cancel delete account.
 */
cancelDeleteAccount.onclick = function () {
    deleteAccountModal.style.display = 'none';
}

/**
 * Delete account
 */
deleteAccount.onclick = function () {
    if (window.confirm('Are you sure you want to delete this account')) {
        formDeleteAccount.submit();
    }
}
