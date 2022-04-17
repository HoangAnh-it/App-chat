const params = new URLSearchParams(window.location.search);
const currentPage = params.get('page');

$(`.page-${currentPage}`).classList.add('active');
