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
        this.countDown = document.getElementById('time-left');
        this.counter = document.getElementById('flips');
        this.officeAudio = new officeAudio();
    }


    startGame() {
        this.cardsToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCard = [];
        this.busy = true;
        setTimeout(() => {
        this.shuffleCards();
        this.timer = this.startTimer();
        this.busy = false;
    }, 500);
        this.turnCardBack();
        this.countDown.innerText = this.timeRemaining;
        this.counter.innerText = this.totalClicks;
}


    startTimer() {
        return setInterval(() => {
        this.timeRemaining--;
        this.countDown.innerText = this.timeRemaining;
        if(this.timeRemaining === 0)
        this.gameOver();
        }, 1000);
    }
    
    flipCards(cards){
        if(this.canflipCards(cards)) {
            this.officeAudio.flip();
            this.totalClicks++;
            this.counter.innerText = this.totalClicks;
            cards.classList.add('visible');
        }
    }

   
gameOver() {
   clearInterval(this.timer);
   this.officeAudio.lose();
    document.getElementById('game-over-text').classList.add('visible');
}

winner(){
    clearInterval(this.timer);
    this.officeAudio.win();
    document.getElementById('winner-text').classList.add('visible');
}

  turnCardBack(){
        this.cardArray.forEach(cards => {
        cards.classList.remove('visible');
    });
    }

//Fisher Yates shuffle algorothim https://medium.com/@oldwestaction/randomness-is-hard-e085decbcbb2

    shuffleCards(){
        for(let i = this.cardArray.length -1; i > 0; i--){
            let randomInt = Math.floor(Math.random() * (i+1));
            this.cardArray[randomInt].style.order = i;
            this.cardArray[i].style.order = randomInt;
        }
    }

    canflipCards(cards){
        return true;
    }
}



function ready() {
    let gametext = Array.from(document.getElementsByClassName('gameplay-text'));
    let card = Array.from(document.getElementsByClassName('cards'));
    let game = new theOffice(5, card);


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