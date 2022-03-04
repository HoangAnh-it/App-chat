// {{!-- document.addEventListener('DOMContentLoaded', (event) => { --}}
    const avatar = document.querySelector('.avatar');
    const option = document.querySelector('.option');
    if(avatar)
        avatar.onclick = function() {
            if(option.style.display =='' || option.style.display == 'none'){
                option.style.display = 'inline-block';
            }else{
                option.style.display = 'none';
            }
        }
// {{!-- }); --}}