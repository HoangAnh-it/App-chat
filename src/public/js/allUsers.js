const params = new URLSearchParams(window.location.search);
let currentPage = params.get('page');

$(`.page-${currentPage}`).classList.add('active');
