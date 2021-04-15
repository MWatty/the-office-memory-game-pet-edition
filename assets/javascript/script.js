//created to add sound effects to provide an interactive element to the game 
class OfficeAudio {
    constructor() {
        this.flipSound = new Audio('assets/audio/flip.wav');
        this.matchSound = new Audio('assets/audio/win.wav');
        this.winSound = new Audio('assets/audio/cheer.wav');
        this.loseSound = new Audio('assets/audio/lose.wav');
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    win() {
        this.winSound.play();
    }
    lose() {
        this.loseSound.play();
    }
}

class TheOffice {
    constructor(totalTime, card) {
        this.cardArray = card;//property of the object which is set from the constructor 
        this.totalTime = totalTime;//property of the object which is set from the constructor 
        this.timeRemaining = totalTime;//whatever the time remaining is at any point given throughout the game
        this.countDown = document.getElementById('time-left');//the actual time pulled from the DOM
        this.counter = document.getElementById('flips');//flip counter pulled from the DOM 
        this.OfficeAudio = new OfficeAudio();//Office Audio that belongs to this particular game object 
    }


    startGame() {
        this.cardsToCheck = null;//when you first start game no cards to check as no cards flipped, when you flip one it becomes cardToCheck
        this.totalClicks = 0;//each time a new game is started flip counter is equal to 0
        this.timeRemaining = this.totalTime;//time resets each time a new game is started 
        this.matchedCard = [];//all the matched cards we get whilst playing go into this array, check against cardArray for victory
        this.busy = true;//is there a scenario occuring whereby the game is busy 
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
            if (this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }

    //create a function to pause the game 
    //create a function to reset the game 


    flipCards(cards) {
        if (this.canflipCards(cards)) {
            this.OfficeAudio.flip();
            this.totalClicks++;
            this.counter.innerText = this.totalClicks;
            cards.classList.add('visible');

            if (this.cardsToCheck) {
                this.areCardsMatched(cards);
            } else {
                this.cardsToCheck = cards;
            }
        }
    }

    areCardsMatched(cards) {
        if (this.whatTypeCard(cards) === this.whatTypeCard(this.cardsToCheck)) {
            this.cardsMatched(cards, this.cardsToCheck);
            this.cardsToCheck = null;
        }
        else {
            this.cardsNoMatch(cards, this.cardsToCheck);
            this.cardsToCheck = null;
        }
    }



    whatTypeCard(cards) {
        return cards.getElementsByClassName('dog-card')[0].src;
    }

    cardsMatched(cards1, cards2) {
        this.matchedCard.push(cards1);
        this.matchedCard.push(cards2);
        this.OfficeAudio.match();
        if (this.matchedCard.length === this.cardArray.length)
            this.winner();
    }


    cardsNoMatch(cards1, cards2) {
        this.busy = true;
        setTimeout(() => {
            cards1.classList.remove('visible');
            cards2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }


    gameOver() {
        clearInterval(this.timer);
        this.OfficeAudio.lose();
        document.getElementById('game-over-text').classList.add('visible');
    }

    winner() {
        clearInterval(this.timer);
        this.OfficeAudio.win();
        document.getElementById('winner-text').classList.add('visible');
    }

    turnCardBack() {
        this.cardArray.forEach(cards => {
            cards.classList.remove('visible');
        });
    }

//Fisher Yates shuffle algorothim used to shuffle cards https://medium.com/@oldwestaction/randomness-is-hard-e085decbcbb2
    shuffleCards() {
        for (let i = this.cardArray.length - 1; i > 0; i--) {
            let randomInt = Math.floor(Math.random() * (i + 1));
            this.cardArray[randomInt].style.order = i;
            this.cardArray[i].style.order = randomInt;
        }
    }
    
//scenarios whereby user cannot flip a card, game busy, clicking on a card that is already matched, clicking on card that is already flipped waiting card to check 
//creates a boolean, if all 3 values are false this will return true 
// if this returns true user can flip the card
canflipCards(cards) {
        return !this.busy && !this.matchedCard.includes(cards) && cards !== this.cardsToCheck;
    }
}


function ready() {
    let gametext = Array.from(document.getElementsByClassName('gameplay-text'));
    let card = Array.from(document.getElementsByClassName('cards'));
    const timeAllowed = 60;
    let game = new TheOffice(timeAllowed, card);

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

//if the HTML page is not loaded put an EventListener on the DOM that says when it is loaded call the ready function
//or else if it is loaded it will call the ready function
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}