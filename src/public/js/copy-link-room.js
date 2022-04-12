const modalGetLinkRoom = $('.modal.link-room');
const btnCopy = $('.copy-link-room');
const link = $('.modal.link-room .link');
const btnClose = $('.modal.link-room .btn-close');
const tooltip = $('.copy-link-room .tooltip');

if (btnCopy) {
    btnCopy.onclick = function () {
        link.select();
        navigator.clipboard.writeText(link.value);

        tooltip.style.display = 'inline-block';
        setTimeout(function () {
            tooltip.style.display = 'none';
        }, 3000);
    }
}

if (btnClose) {
    btnClose.onclick = function () {
        modalGetLinkRoom.style.display = 'none';
    }
}
