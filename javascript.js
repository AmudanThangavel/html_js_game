const canvas = document.getElementById('bcanvas');
const ctx = canvas.getContext('2d');


const player_img = document.getElementById('red');
const knife_img = document.getElementById('knife');

/*
// Change properties of canvas

canvas.width = 800;
canvas.height = 500;

// Variables

const cw = canvas.width; // width of canvas
const ch = canvas.height; // height of canvas

// Images

const player_img = document.getElementById('red');
const knife_img = document.getElementById('knife');
const tknife_img = document.getElementById('tknife');
const twoknife_img = document.getElementById('twoknife');

const player = {
    w: 40,
    h: 40,
    x: 25,
    y: 355,
    speed: 4,
    dx: 0,
    dy: 0
}

const knife = {
    w: 50,
    h: 25,
    x: 100,
    y: 355,
    speed: 5,
    dx: 0,
    dy: 0
}

const twoknife = {
    w: 50,
    h: 25,
    x: 300,
    y: 355,
    speed: 5,
    dx: 0,
    dy: 0
}

const tknife = {
    w: 50,
    h: 25,
    x: 500,
    y: 355,
    speed: 5,
    dx: 0,
    dy: 0
}

// Used for 'setInterval'

let presetTime = 1200;

let enemySpeed = 2;

// Background line



// Random Variables

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Random Number Interval



// elements Draw function

function drawPlayer() {
    ctx.drawImage(player_img, player.x, player.y, player.w, player.h);
}

// function drawKnife() {
//     ctx.drawImage(knife_img, knife.x, knife.y, knife.w, knife.h);
// }


function drawtKnife() {
    ctx.drawImage(tknife_img, tknife.x, tknife.y, tknife.w, tknife.h);
}

function drawtwoKnife() {
    ctx.drawImage(twoknife_img, twoknife.x, twoknife.y, twoknife.w, twoknife.h);
}

*/

const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");

//Global variables

//SFX
let scoreSFX = new Audio("https://archive.org/download/classiccoin/classiccoin.wav");
let gameOverSFX = new Audio("https://archive.org/download/smb_gameover/smb_gameover.wav");
let jumpSFX = new Audio("https://archive.org/download/jump_20210424/jump.wav");



//Global Functions

let player = null;
let score = 0;
//Used to see if user has scored another 10 points or not
let scoreIncrement = 0;
let listBlock = [];
//Enemy can speed up when player has scored points at intervals of 10
let enemySpeed = 5;
//So ball doesn't score more then one point at a time
let canScore = true;
//Used for 'setInterval'
let presetTime = 1000;

function startGame() {
    player = new Player(150, 350, 50, "black");
    listBlock = [];
    score = 0;
    scoreIncrement = 0;
    enemySpeed = 5;
    canScore = true;
    presetTime = 1000;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Returns true of colliding
function squaresColliding(player, block) {
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
    //Don't need pixel perfect collision detection
    s2.size = s2.size - 10;
    s2.x = s2.x + 10;
    s2.y = s2.y + 10;
    return !(
        s1.x > s2.x + s2.size || //R1 is to the right of R2
        s1.x + s1.size < s2.x || //R1 to the left of R2
        s1.y > s2.y + s2.size || //R1 is below R2
        s1.y + s1.size < s2.y //R1 is above R2
    )
}

//Returns true if past player past block
function isPastBlock(player, block) {
    return (
        player.x + (player.size / 2) > block.x + (block.size / 4) &&
        player.x + (player.size / 2) < block.x + (block.size / 4) * 3
    )
}

class Player {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.jumpHeight = 17;
        //These 3 are used for jump configuration
        this.shouldJump = false;
        this.jumpCounter = 0;
        this.jumpUp = true;
        //Related to spin animation
        this.spin = 0;
        //Get a perfect 90 degree rotation
        this.spinIncrement = 90 / 32;
    }

    draw() {
        this.jump();
        ctx.drawImage(player_img, this.x, this.y, this.size, this.size);
        //Reset the rotation so the rotation of other elements is not changed
        if (this.shouldJump) this.counterRotation();
    }

    jump() {
        if (this.shouldJump) {
            this.jumpCounter++;
            if (this.jumpCounter < 20) {
                //Go up
                this.y -= this.jumpHeight;
            } else if (this.jumpCounter > 19 && this.jumpCounter < 24) {
                this.y += 0;
            } else if (this.jumpCounter < 43) {
                //Come back down
                this.y += this.jumpHeight;
            }
            this.rotation();
            //End the cycle
            if (this.jumpCounter >= 43) {
                //Reset spin ready for another jump
                this.counterRotation();
                this.spin = 0;
                this.shouldJump = false;
            }
        }
    }


    rotation() {
        let offsetXPosition = this.x + (this.size / 2);
        let offsetYPosition = this.y + (this.size / 2);
        ctx.translate(offsetXPosition, offsetYPosition);
        //Division is there to convert degrees into radians
        ctx.rotate(this.spin * Math.PI / 180);
        ctx.rotate(this.spinIncrement * Math.PI / 180);
        ctx.translate(-offsetXPosition, -offsetYPosition);
        //4.5 because 90 / 20 (number of iterations in jump) is 4.5
        this.spin += this.spinIncrement;
    }

    counterRotation() {
        //This rotates the cube back to its origin so that it can be moved upwards properly
        let offsetXPosition = this.x + (this.size / 2);
        let offsetYPosition = this.y + (this.size / 2);
        ctx.translate(offsetXPosition, offsetYPosition);
        ctx.rotate(-this.spin * Math.PI / 180);
        ctx.translate(-offsetXPosition, -offsetYPosition);
    }

}

// Obstacles

class Obstacles {
    constructor(size, speed) {
        this.x = canvas.width + size;
        this.y = 335;
        this.slideSpeed = speed;
        this.size = size;
    }

    drawKnife() {
        ctx.drawImage(knife_img, this.x, this.y, this.size * 2, this.size);
    }

    slide() {
        this.drawKnife();
        this.x -= this.slideSpeed;
    }
}

// Auto generate blocks
function generateObstacles() {
    let timeDelay = randomInterval(presetTime);
    listBlock.push(new Obstacles(50, enemySpeed));
    setTimeout(generateObstacles, timeDelay);
}


function randomInterval(timeInterval) {
    let returnTime = timeInterval;
    if (Math.random() < 0.5) {
        returnTime += getRandomNumber(presetTime / 3, presetTime * 1.5);
    } else {
        returnTime -= getRandomNumber(presetTime / 5, presetTime / 2);
    }
    return returnTime;
}

// Background line

function drawBackGroundLine() {
    ctx.beginPath();
    ctx.moveTo(0, 396);
    ctx.lineTo(800, 396);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'Black';
    ctx.stroke();
}


function drawScore() {
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    let scoreString = score.toString();
    let xOffset = ((scoreString.length - 1) * 20);
    ctx.fillText(scoreString, 280 - xOffset, 100);
}

function shouldIncreaseSpeed() {
    //Check to see if game speed should be increased
    if (scoreIncrement + 10 === score) {
        scoreIncrement = score;
        enemySpeed++;
        presetTime >= 100 ? presetTime -= 100 : presetTime = presetTime / 2;
        //Update speed of existing blocks
        listBlock.forEach(block => {
            block.slideSpeed = enemySpeed;
        });
        console.log("Speed increased");
    }
}


let animationId = null;
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Canvas Logic
    drawBackGroundLine();
    drawScore();
    //Foreground
    player.draw();

    //Check to see if game speed should be increased
    shouldIncreaseSpeed();

    listBlock.forEach((listBlock, index) => {
        listBlock.slide();
        //End game as player and enemy have collided
        if (squaresColliding(player, listBlock)) {
            gameOverSFX.play();
            cardScore.textContent = score;
            card.style.display = "block";
            cancelAnimationFrame(animationId);
        }
        //User should score a point if this is the case
        if (isPastBlock(player, listBlock) && canScore) {
            canScore = false;
            scoreSFX.currentTime = 0;
            scoreSFX.play();
            score++;

        }

        //Delete block that has left the screen
        if ((listBlock.x + listBlock.size) <= 0) {
            setTimeout(() => {
                listBlock.splice(index, 1);
            }, 0)
        }
    });

}

//Call first time on document load
startGame();
animate();
setTimeout(() => {
    generateObstacles();
}, randomInterval(presetTime))

//Event Listeners
addEventListener("keydown", e => {
    if (e.code === 'Space') {
        if (!player.shouldJump) {
            jumpSFX.play();
            player.jumpCounter = 0;
            player.shouldJump = true;
            canScore = true;
        }
    }
});

//Restart game
function restartGame(button) {
    card.style.display = "none";
    button.blur();
    startGame();
    requestAnimationFrame(animate);
}
    // // Movement

    // function clear() {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    // }

    // function newPos() {
    //     player.x += player.dx;
    //     player.y += player.dy;
    // }


    // // Update function

    // let listBlock = [];



    // // Returns 'true' if collision ocurres
    // function knifeColliding(player, obs) {
    //     let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
    //     let s2 = Object.assign(Object.create(Object.getPrototypeOf(obs)), obs);
    //     // Don't need pixel perfect collision detection
    //     s2.size = s2.size - 10;
    //     s2.x = s2.x + 10;
    //     s2.y = s2.y + 10;
    //     return !(
    //         s1.x > s2.x + s2.size ||
    //         s1.x + s1.size < s2.x ||
    //         s1.y > s2.y + s2.size ||
    //         s1.y + s1.size < s2.y
    //     )
    // }

    // function update() {
    //     clear();

    //     drawPlayer();

    //     //drawKnife();

    //     drawtKnife();

    //     drawtwoKnife();

    //     newPos();

    //     drawBackGroundLine();


    //     listBlock.forEach((listBlock, index) => {
    //         listBlock.slide();

    //         // End game as player and knife have collided
    //         if (knifeColliding(player, listBlock)) {
    //             gameOverSFX.play();

    //             cancelAnimationFrame(animationId)
    //         }
    //         // Delete knife left the canvas
    //         if ((listBlock.x + listBlock.size) <= 0) {
    //             setTimeout(() => {
    //                 listBlock.splice(index, 1);
    //             }, 0)
    //         }
    //     });


    //     requestAnimationFrame(update);



    // }



    // update();

    // setTimeout(() => {
    //     generateObstacles();
    // }, randomNumberInterval(presetTime));


    // // jump function

    // // function jump() {
    // //     let timerUpId = setInterval(function () {
    // //         if (player.y < 250) {
    // //             clearInterval(timerUpId);
    // //             let timerdownId = setInterval(function () {
    // //                 if (player.y > 344) {
    // //                     clearInterval(timerdownId);
    // //                 }
    // //                 player.y += 10;
    // //             }, 25);
    // //         }
    // //         player.y -= 10;
    // //     }, 25)
    // // }

    // // Key Event Function and EventListener

    // function keyDown(e) {
    //     if (e.key === " ") {
    //         jump();
    //     }
    // }

    // function keyUp(e) {
    //     if (
    //         e.key == ' '
    //     ) {
    //         player.dx = 0;
    //         player.dy = 0;
    //     }
    // }


    // update();

    // document.addEventListener('keydown', keyDown);
    // document.addEventListener('keyup', keyUp);