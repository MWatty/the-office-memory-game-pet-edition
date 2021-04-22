"use strict";

//Class OfficeAudio is used to assist in the addition of sound effects to the game 
class OfficeAudio {
    constructor() {
        this.flipSound = new Audio("assets/audio/flip.wav");//
        this.matchSound = new Audio("assets/audio/win.wav");
        this.winSound = new Audio("assets/audio/woof.wav");
        this.loseSound = new Audio("assets/audio/lose.wav");
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
    constructor(totalTime, cards) {
        this.cardArray = cards; //Property of the object which is set from the constructor
        this.totalTime = totalTime; //Property of the object which is set from the constructor
        this.timeRemaining = totalTime; //Whatever the time remaining is at any point given throughout the game
        this.countDown = document.getElementById("time-left"); //The actual time value pulled from the DOM
        this.counter = document.getElementById("flips"); //Flip counter value pulled from the DOM
        this.OfficeAudio = new OfficeAudio(); //Office Audio that belongs to this particular game object
    }

    startGame() {
        this.cardsToCheck = null; //When you first start game no cards to check as no cards flipped, when you flip one it becomes cardToCheck
        this.totalClicks = 0; //Each time a new game is started flip counter is equal to 0
        this.timeRemaining = this.totalTime; //Time resets each time a new game is started
        this.matchedCard = []; //All the matched cards we get whilst playing go into this array, check against cardArray for victory
        this.busy = true; //Is there a scenario occuring whereby the game is busy
        this.shuffleCards();
        this.timer = this.startTimer();
        this.busy = false;
        this.turnCardBack();
        this.countDown.innerText = this.timeRemaining; //Resetting countdown when starting a new game
        this.counter.innerText = this.totalClicks; //Resetting counter when starting a new game
    }

    /*Function to start countdown timer, counts down by one second, updates value of timer on HTML page, 
    if time remaining equals zero calls game over function*/
    startTimer() {
        return setInterval(() => {
            this.timeRemaining--;
            this.countDown.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) this.gameOver();
        }, 1000);
    }

    //Function to pause the countdown timer, cards cannot be flipped whilst paused 
    pauseGame() {
        this.busy = true;
        clearInterval(this.timer);//
    }

    //Function to play the game after pausing, allows cards to be flipped and the timer to be restarted 
    unpauseGame() {
        this.busy = false;
        clearInterval(this.timer);
        this.timer = this.startTimer();
    }

    //Function to stop current game and start a new game
    resetGame() {
        clearInterval(this.timer);
        this.startGame();
    }

    /*Function to signal the end of the game, the countdown is cleared,  gameover audio plays and 
     gameover text pops up*/
    gameOver() {
        clearInterval(this.timer);
        this.OfficeAudio.lose();
        document.getElementById("game-over-text").classList.add("visible");
    }

    /*Function to signal winning the game, the countdown is cleared, winning audio plays and 
     winning text pops up*/
    winner() {
        clearInterval(this.timer);
        this.OfficeAudio.win();
        document.getElementById("winner-text").classList.add("visible");
    }

    //Function loops through cards array and removes visible class
    turnCardBack() {
        this.cardArray.forEach((card) => {
            card.classList.remove("visible");
        });
    }

    /*Function if the user can flip the card, adds audio, iterates flips, updates value of counter,flips card.
    If else statement then checks are we trying to match a card or flipping for first time*/
    flipCards(card) {
        if (this.canflipCards(card)) {
            this.OfficeAudio.flip();
            this.totalClicks++;
            this.counter.innerText = this.totalClicks;
            card.classList.add("visible");

            if (this.cardsToCheck) {
                this.areCardsMatched(card);
            } else {
                this.cardsToCheck = card;
            }
        }
    }

    /*Function if the card clicked equals the whatcard type then there is a match
    Match or no match the value has to be null*/
    areCardsMatched(card) {
        if (this.whatTypeCard(card) === this.whatTypeCard(this.cardsToCheck)) {
            this.cardsMatched(card, this.cardsToCheck);
            this.cardsToCheck = null;
        } else {
            this.cardsNoMatch(card, this.cardsToCheck);
            this.cardsToCheck = null;
        }
    }

    /*Function pushes both cards to matched cards array and checks if there is a match,
    audio is played if there is a match and if all of the pairs are matched winner function
    is called*/
    cardsMatched(card1, card2) {
        this.matchedCard.push(card1);
        this.matchedCard.push(card2);
        this.OfficeAudio.match();
        if (this.matchedCard.length === this.cardArray.length) {
            this.winner();
        }
    }

    /*Function to flip two cards that do not match back over,
    one second allowed to view cards then registers as not busy flips back*/
    cardsNoMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove("visible");
            card2.classList.remove("visible");
            this.busy = false;
        }, 1000);
    }

    /*Function shuffle cards  Fisher Yates shuffle algorothim used 
    https://medium.com/@oldwestaction/randomness-is-hard-e085decbcbb2*/
    shuffleCards() {
        for (let i = this.cardArray.length - 1; i > 0; i--) {
            let randomInt = Math.floor(Math.random() * (i + 1));
            this.cardArray[randomInt].style.order = i;
            this.cardArray[i].style.order = randomInt;
        }
    }

    //Function returns the card value and the source attribute
    whatTypeCard(card) {
        return card.getElementsByClassName("dog-card")[0].src;
    }

    /*Function identifies times whereby a user cannot flip a card, game busy, clicking on a card
    that is already matched, clicking on card that is already flipped waiting card to check.
    Creates a boolean, if all 3 values are false this will return true.If this returns true user 
    can flip the card*/
    canflipCards(card) {
        return !this.busy && !this.matchedCard.includes(card) && card !== this.cardsToCheck;
    }
}

/*This function initialises the programme, creates an array of the HTML elements using cards and gametext.
Then loops over the array and adds click event listeners. This also adds event listeners for clicking of the pause,
play and reset buttons*/
function ready() {
    const GAMETEXT = Array.from(document.getElementsByClassName("gameplay-text"));
    const CARDS = Array.from(document.getElementsByClassName("card"));
    const RESET = document.getElementById("resetButton");
    const PAUSE = document.getElementById("pauseButton");
    const UNPAUSE = document.getElementById("unpauseButton");
    const TIME_ALLOWED = 60;
    const GAME = new TheOffice(TIME_ALLOWED, CARDS);

    GAMETEXT.forEach((gameplay) => {
        gameplay.addEventListener("click", () => {
            gameplay.classList.remove("visible");
            GAME.startGame();
        });
    });
    CARDS.forEach((card) => {
        card.addEventListener("click", () => {
            GAME.flipCards(card);
        });
    });

    RESET.addEventListener("click", () => {
        GAME.resetGame();
    });

    PAUSE.addEventListener("click", () => {
        GAME.pauseGame();
    });

    UNPAUSE.addEventListener("click", () => {
        GAME.unpauseGame();
    });
}

/*If the HTML page is not loaded puts an EventListener on the DOM that says when it is loaded call the ready function
or else if it is loaded it will call the ready function*/
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready());
} else {
    ready();
}
