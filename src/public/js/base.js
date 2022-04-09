const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const userId = Number.parseInt($('.client-id')?.dataset.user_id);
console.log('Your id =>', userId);
