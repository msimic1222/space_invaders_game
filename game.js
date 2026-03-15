const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "player.png";

const alienImg = new Image();
alienImg.src = "alien.png";

const bulletImg = new Image();
bulletImg.src = "laserbeam.png";

const explosionImg = new Image();
explosionImg.src = "explosion.png";

let player;
let aliens;
let bullets;
let explosions;

let score;
let lives;

let gameState = "start";

let alienDirection;
let alienSpeed;

const START_SPEED = 40;     // pixels per second
const SPEED_INCREASE = 5;
const MAX_SPEED = 120;

const bulletSpeed = 300;    // pixels per second

let keys = {};

document.addEventListener("keydown", (e) => {

    keys[e.key] = true;

    if (gameState === "start" && e.key === "Enter") {
        startGame();
    }

    if ((gameState === "gameover" || gameState === "win") && e.key === "Enter") {
        startGame();
    }

    if (gameState === "playing" && e.key === " ") {
        shoot();
    }

});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function startGame() {

    player = {
        x: canvas.width / 2 - 20,
        y: canvas.height - 70,
        width: 40,
        height: 40,
        speed: 300
    };

    bullets = [];
    explosions = [];

    score = 0;
    lives = 3;

    alienSpeed = START_SPEED;
    alienDirection = 1;

    aliens = [];

    const rows = 3;
    const cols = 5;

    for (let r = 0; r < rows; r++) {

        for (let c = 0; c < cols; c++) {

            aliens.push({
                x: 100 + c * 120,
                y: 60 + r * 70,
                width: 40,
                height: 40
            });

        }

    }

    gameState = "playing";
}

function shoot() {

    bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20
    });

}

function update(deltaTime) {

    if (gameState !== "playing") return;

    if (keys["ArrowLeft"]) {
        player.x -= player.speed * deltaTime;
    }

    if (keys["ArrowRight"]) {
        player.x += player.speed * deltaTime;
    }

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    bullets.forEach(b => {
        b.y -= bulletSpeed * deltaTime;
    });

    bullets = bullets.filter(b => b.y > -20);

    let hitEdge = false;

    aliens.forEach(a => {

        if (a.x + a.width >= canvas.width || a.x <= 0) {
            hitEdge = true;
        }

    });

    if (hitEdge) {

        alienDirection *= -1;

        aliens.forEach(a => {
            a.y += 20;
        });

    }

    aliens.forEach(a => {
        a.x += alienSpeed * alienDirection * deltaTime;
    });

    bullets.forEach((b, bi) => {

        aliens.forEach((a, ai) => {

            if (
                b.x < a.x + a.width &&
                b.x + b.width > a.x &&
                b.y < a.y + a.height &&
                b.y + b.height > a.y
            ) {

                explosions.push({
                    x: a.x,
                    y: a.y,
                    timer: 0.3
                });

                aliens.splice(ai, 1);
                bullets.splice(bi, 1);

                score += 100;

                alienSpeed += SPEED_INCREASE;
                alienSpeed = Math.min(alienSpeed, MAX_SPEED);

            }

        });

    });

    explosions.forEach(e => {
        e.timer -= deltaTime;
    });

    explosions = explosions.filter(e => e.timer > 0);

    aliens.forEach(a => {

        if (a.y + a.height >= player.y) {
            gameState = "gameover";
        }

    });

    if (aliens.length === 0) {
        gameState = "win";
    }

}

function draw() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === "start") {

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Space Invaders", canvas.width / 2, 250);

        ctx.font = "20px Arial";
        ctx.fillText("Press ENTER to Start", canvas.width / 2, 320);

        return;

    }

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    aliens.forEach(a => {
        ctx.drawImage(alienImg, a.x, a.y, a.width, a.height);
    });

    bullets.forEach(b => {
        ctx.drawImage(bulletImg, b.x, b.y, b.width, b.height);
    });

    explosions.forEach(e => {
        ctx.drawImage(explosionImg, e.x, e.y, 40, 40);
    });

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 20, 30);

    for (let i = 0; i < lives; i++) {
        ctx.drawImage(playerImg, canvas.width - 40 - i * 40, 10, 30, 30);
    }

    if (gameState === "gameover") {

        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, 300);

        ctx.font = "20px Arial";
        ctx.fillText("Press ENTER to Restart", canvas.width / 2, 350);

    }

    if (gameState === "win") {

        ctx.fillStyle = "green";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("YOU DEFEATED ALL THE INVADERS!", canvas.width / 2, 300);

        ctx.font = "20px Arial";
        ctx.fillText("Press ENTER to Play Again", canvas.width / 2, 350);

    }

}

let lastTime = 0;

function gameLoop(timeStamp) {

    const deltaTime = (timeStamp - lastTime) / 1000;
    lastTime = timeStamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);