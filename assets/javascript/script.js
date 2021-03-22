class OfficeAudio {
    constructor(){
        this.flipSound = new Audio('assets/audio/woof.wav');
        this.matchSound = new Audio('assets/audio/win.wav');
        this.winSound = new Audio('assets/audio/cheer.wav');
        this.loseSound = new Audio('assets/audio/lose.wav');
    }
    flip(){
        this.flipSound.play();
    }
    match(){
        this.matchSound.play();
    }
    win(){
        this.winSound.play();
    }
    lose(){
        this.loseSound.play();
    }
}







function ready() {
    let gametext = Array.from(document.getElementsByClassName('gameplay-text'));
    let card = Array.from(document.getElementsByClassName('cards'));

    gametext.forEach(gameplay => {
        gameplay.addEventListener('click', () => {
            gameplay.classList.remove('visible');
            //need to add function
        });
    });
    card.forEach(cards => {
        cards.addEventListener('click', () => {
            //need to add function
        });
    });
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}