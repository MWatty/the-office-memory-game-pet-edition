if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}

function ready() {
    let gametext = Array.from(document.getElementsByClassName('gameplay-text'));
    let card = Array.from(document.getElementsByClassName('cards'));

    gametext.forEach(gameplay => {
        gameplay.addEventListener('click', () => {
            gameplay.classList.remove('visible');
        });
    });
}