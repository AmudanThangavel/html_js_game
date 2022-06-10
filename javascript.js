const canvas = document.getElementById('bcanvas');
const ctx = canvas.getContext('2d');

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

function drawBackGroundLine() {
    ctx.beginPath();
    ctx.moveTo(0, 396);
    ctx.lineTo(800, 396);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'Black';
    ctx.stroke();
}

// Random Variables

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Random Number Interval

function randomNumberInterval(timeInterval) {
    let returnTime = timeInterval;
    if (Math.random() < 0.5) {
        returnTime += getRandomNumber(presetTime / 3, presetTime * 1.5);
    } else {
        returnTime -= getRandomNumber(presetTime / 5, presetTime / 2);
    }
    return returnTime;
}

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


// Movement

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.x += player.dx;
    player.y += player.dy;
}

// Obstacles

class Obstacles {
    constructor(speed) {
        this.x = canvas.width + knife.w;
        this.y = 355;
        this.slideSpeed = speed;
    }

    drawKnife() {
        ctx.drawImage(knife_img, this.x, this.y, knife.w, knife.h);
    }

    slide() {
        this.drawKnife();
        this.x -= this.slideSpeed;
    }
}
// Update function

let listBlock = [];

// Auto generate blocks
function generateObstacles() {
    let timeDelay = randomNumberInterval(presetTime);
    listBlock.push(new Obstacles(enemySpeed));
    setTimeout(generateObstacles, timeDelay);
}

// Returns 'true' if collision ocurres
function knifeColliding(player, obs) {
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(obs)), obs);
    // Don't need pixel perfect collision detection
    s2.size = s2.size - 10;
    s2.x = s2.x + 10;
    s2.y = s2.y + 10;
    return !(
        s1.x > s2.x + s2.size ||
        s1.x + s1.size < s2.x ||
        s1.y > s2.y + s2.size ||
        s1.y + s1.size < s2.y
    )
}

function update() {
    clear();

    drawPlayer();

    //drawKnife();

    drawtKnife();

    drawtwoKnife();

    newPos();

    drawBackGroundLine();


    listBlock.forEach((listBlock, index) => {
        listBlock.slide();

        // End game as player and knife have collided
        if (knifeColliding(player, listBlock)) {
            gameOverSFX.play();

            cancelAnimationFrame(animationId)
        }
        // Delete knife left the canvas
        if ((listBlock.x + listBlock.size) <= 0) {
            setTimeout(() => {
                listBlock.splice(index, 1);
            }, 0)
        }
    });


    requestAnimationFrame(update);



}



update();

setTimeout(() => {
    generateObstacles();
}, randomNumberInterval(presetTime));


// jump function

function jump() {
    let timerUpId = setInterval(function () {
        if (player.y < 250) {
            clearInterval(timerUpId);
            let timerdownId = setInterval(function () {
                if (player.y > 344) {
                    clearInterval(timerdownId);
                }
                player.y += 10;
            }, 25);
        }
        player.y -= 10;
    }, 25)
}

// Key Event Function and EventListener

function keyDown(e) {
    if (e.key === " ") {
        jump();
    }
}

function keyUp(e) {
    if (
        e.key == ' '
    ) {
        player.dx = 0;
        player.dy = 0;
    }
}


update();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);