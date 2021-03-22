class officeAudio {
    constructor(){
        this.flipSound = new Audio('assets/audio/flip.wav');
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

class theOffice {
    constructor(totalTime, card) {
        this.cardArray = card;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.countdown = document.getElementById('time-left');
        this.counter = document.getElementById('flips');
        this.officeAudio = new officeAudio();
    }
    startGame() {
        this.cardsToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCard = [];
        this.busy = true;
       
    }
    flipCards(cards){
        if(this.canflipCards(cards)) {
            this.officeAudio.flip();
            this.totalClicks++;
            this.counter.innerText = this.totalClicks;
            cards.classList.add('visible');
        }
    }

    canflipCards(cards){
        return true;
    }
}



function ready() {
    let gametext = Array.from(document.getElementsByClassName('gameplay-text'));
    let card = Array.from(document.getElementsByClassName('cards'));
    let game = new theOffice(60, card);


    gametext.forEach(gameplay => {
        gameplay.addEventListener('click', () => {
            gameplay.classList.remove('visible');
            game.startGame();
        });
    });
    card.forEach(cards => {
        cards.addEventListener('click', () => {
          game.flipCards(cards);
        });
    });
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}