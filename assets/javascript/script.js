"use strict";

//You Tube Tutorial by PortEXE(https://www.youtube.com/watch?v=3uuQ3g92oPQ&t=3042s) was used to assist in the creation of the JavaScript below

//Addition of cound effects to various points throughout the game
//This means that variable belongs to that particular object
class OfficeAudio {
    constructor() {
        this.flipSound = new Audio("assets/audio/flip.wav");
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

    //Create a countdown timer counts down by one second, updates value of timer on HTML page, if time remaining equals zero calls game over function
    startTimer() {
        return setInterval(() => {
            this.timeRemaining--;
            this.countDown.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) this.gameOver();
        }, 1000);
    }

    //Create a function to pause the game
    pauseGame() {
        this.busy = true;
        clearInterval(this.timer);
    }

    //Create a funciton to play the game after pausing
    unpauseGame() {
        this.busy = false;
        clearInterval(this.timer);
        this.timer = this.startTimer();
    }

    //Create a function to reset the game
    resetGame() {
        clearInterval(this.timer);
        this.startGame();
    }

    //Timer is cleared, plays audio, gameover text pops up
    gameOver() {
        clearInterval(this.timer);
        this.OfficeAudio.lose();
        document.getElementById("game-over-text").classList.add("visible");
    }

    //Stops counting down, plays audio, winning text pops up
    winner() {
        clearInterval(this.timer);
        this.OfficeAudio.win();
        document.getElementById("winner-text").classList.add("visible");
    }

    //Loops through cards array and removes visible class
    turnCardBack() {
        this.cardArray.forEach((maura) => {
            maura.classList.remove("visible");
        });
    }

    //If user can flips the card, adds sound, iterates flips, updates value of counter,flips card
    //If statement then checks are we trying to match a card or flipping for first time
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

    //If the card we clicked equals the whatcard type then we have a match
    //Match or no match the value has to be null
    areCardsMatched(card) {
        if (this.whatTypeCard(card) === this.whatTypeCard(this.cardsToCheck)) {
            this.cardsMatched(card, this.cardsToCheck);
            this.cardsToCheck = null;
        } else {
            this.cardsNoMatch(card, this.cardsToCheck);
            this.cardsToCheck = null;
        }
    }

    //Pushes both cards to matched cards array and checks if there is a match
    cardsMatched(card1, card2) {
        this.matchedCard.push(card1);
        this.matchedCard.push(card2);
        this.OfficeAudio.match();
        if (this.matchedCard.length === this.cardArray.length) {
            this.winner();
        }
    }

    //Two cards that do not match are flipped back over
    //One second allowed to view cards then registers as not busy flips back
    cardsNoMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove("visible");
            card2.classList.remove("visible");
            this.busy = false;
        }, 1000);
    }

    //Fisher Yates shuffle algorothim used to shuffle cards https://medium.com/@oldwestaction/randomness-is-hard-e085decbcbb2
    shuffleCards() {
        for (let i = this.cardArray.length - 1; i > 0; i--) {
            let randomInt = Math.floor(Math.random() * (i + 1));
            this.cardArray[randomInt].style.order = i;
            this.cardArray[i].style.order = randomInt;
        }
    }

    //Returning the card value and the source attribute
    whatTypeCard(card) {
        return card.getElementsByClassName("dog-card")[0].src;
    }

    //Scenarios whereby user cannot flip a card, game busy, clicking on a card that is already matched, clicking on card that is already flipped waiting card to check
    //Creates a boolean, if all 3 values are false this will return true
    //If this returns true user can flip the card
    canflipCards(card) {
        return !this.busy && !this.matchedCard.includes(card) && card !== this.cardsToCheck;
    }
}

// This function initialises the programme
//Creates an array of the HTML elements
//Then loops over the array and adds click event listeners
function ready() {
    const GAMETEXT = Array.from(document.getElementsByClassName("gameplay-text"));
    const CARDS = Array.from(document.getElementsByClassName("card"));
    const RESET = Array.from(document.getElementsByClassName("resetbutton"));
    const PAUSE = Array.from(document.getElementsByClassName("pausebutton"));
    const UNPAUSE = Array.from(document.getElementsByClassName("unpausebutton"));
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
    RESET.forEach((resetbutton) => {
        resetbutton.addEventListener("click", () => {
            GAME.resetGame();
        });
    });
    PAUSE.forEach((pausebutton) => {
        pausebutton.addEventListener("click", () => {
            GAME.pauseGame();
        });
    });

    UNPAUSE.forEach((unpausebutton) => {
        unpausebutton.addEventListener("click", () => {
            GAME.unpauseGame();
        });
    });
}

//If the HTML page is not loaded put an EventListener on the DOM that says when it is loaded call the ready function
//Or else if it is loaded it will call the ready function
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready());
} else {
    ready();
}
