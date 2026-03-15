/***************
Marko Simic
Space Invaders Game - COMP 2800
JavaScript version of the entire game, and the main file to run the game in a browser.
*****************************************************************************8*/


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

// images loaded before starting the game

const playerImg = new Image();
playerImg.src = "player.png";

const alienImg = new Image(); // image for the invaders 
alienImg.src = "alien.png";

const laserImg = new Image(); // image for players laser/bullet 
laserImg.src = "laserbeam.png";

const explosionImg = new Image();
explosionImg.src = "explosion.png"; // image for explosion when player or alien is hit

// GAME STATE 

let gameState = "title";

// VARIABLES

let player; 
let bullets;
let alienBullets;
let aliens;
let explosions;

let score;
let lives;
let alienDirection;
let gameOverReason = "";

// CLASSES

class Player{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.width=40;
        this.height=40;
        this.speed=6;
    }

    moveLeft(){
        this.x-=this.speed;
        if(this.x<0) this.x=0;
    }

    moveRight(){
        this.x+=this.speed;
        if(this.x+this.width>W)
            this.x=W-this.width;
    }

    draw(){
        ctx.drawImage(playerImg,this.x,this.y,this.width,this.height);
    }
}

class Alien{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.width=40;
        this.height=40;
    }

    draw(){
        ctx.drawImage(alienImg,this.x,this.y,this.width,this.height);
    }
}

class Bullet{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.width=16;
        this.height=32;
        this.speed=8;
    }

    move(){
        this.y-=this.speed;
    }

    draw(){
        ctx.drawImage(laserImg,this.x,this.y,this.width,this.height);
    }
}

class AlienBullet{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.width=6;
        this.height=16;
        this.speed=4;
    }

    move(){
        this.y+=this.speed;
    }

    draw(){
        ctx.fillStyle="red";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

class Explosion{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.timer=20;
    }

    draw(){
        ctx.drawImage(explosionImg,this.x,this.y,40,40);
        this.timer--;
    }

    done(){
        return this.timer<=0;
    }
}

// START GAME 

function startGame(){

    player = new Player(380,520);

    bullets=[];
    alienBullets=[];
    aliens=[];
    explosions=[];

    score=0;
    lives=3;

    alienDirection=2;

    for(let r=0;r<3;r++){
        for(let c=0;c<5;c++){
            aliens.push(new Alien(100+c*120,60+r*60));
        }
    }

    gameState="playing";
}

// INPUT CONTROLS

const keys={};

document.addEventListener("keydown",e=>{

    keys[e.code]=true;

    if(gameState==="title" && e.code==="Enter"){
        startGame();
    }

});

document.addEventListener("keyup",e=>{
    keys[e.code]=false;
});

// GAME LOOP

let lastTime = 0;

function gameLoop(timeStamp){

    const deltaTime = (timeStamp - lastTime) / 16.67;
    lastTime = timeStamp;

    ctx.clearRect(0,0,W,H);

    if(gameState==="title"){

        ctx.fillStyle="white";
        ctx.textAlign="center";

        ctx.font="60px Arial";
        ctx.fillText("SPACE INVADERS",W/2,250);

        ctx.font="30px Arial";
        ctx.fillText("Press ENTER to Start",W/2,320);
    }

    else if(gameState==="playing"){

        if(keys["ArrowLeft"]) player.x -= player.speed * deltaTime;
        if(keys["ArrowRight"]) player.x += player.speed * deltaTime;

        if(player.x < 0) player.x = 0;
        if(player.x + player.width > W) player.x = W - player.width;

        if(keys["Space"] && bullets.length===0){
            bullets.push(new Bullet(player.x+16,player.y));
        }

        bullets.forEach((b,i)=>{
            b.y -= b.speed * deltaTime;

            if(b.y < 0) bullets.splice(i,1);
        });

        bullets.forEach((b,bi)=>{
            aliens.forEach((a,ai)=>{

                if(
                    b.x<a.x+a.width &&
                    b.x+b.width>a.x &&
                    b.y<a.y+a.height &&
                    b.y+b.height>a.y
                ){

                    explosions.push(new Explosion(a.x,a.y));

                    aliens.splice(ai,1);
                    bullets.splice(bi,1);

                    score+=10;
                }

            });
        });

        if(Math.random()<0.008 && aliens.length>0){

            const shooter = aliens[Math.floor(Math.random()*aliens.length)];

            alienBullets.push(
                new AlienBullet(shooter.x+20,shooter.y+40)
            );
        }

        alienBullets.forEach((b,i)=>{

            b.y += b.speed * deltaTime;

            if(b.y>H) alienBullets.splice(i,1);

            if(
                b.x<player.x+player.width &&
                b.x+b.width>player.x &&
                b.y<player.y+player.height &&
                b.y+b.height>player.y
            ){

                alienBullets.splice(i,1);

                lives--;

                explosions.push(new Explosion(player.x,player.y));

                if(lives<=0){
                    gameOverReason="You ran out of lives!";
                    gameState="gameover";
                }
            }

        });

        let alive = aliens.length;

        if(alive > 0){

            let sign = Math.sign(alienDirection);

            alienDirection = sign * (1.6 + (15 - alive) / 6);

            if(Math.abs(alienDirection) > 8)
                alienDirection = sign * 8;
        }

        let hitEdge=false;

        aliens.forEach(a=>{
            if(
                a.x+alienDirection<0 ||
                a.x+a.width+alienDirection>W
            ){
                hitEdge=true;
            }
        });

        if(hitEdge){
            alienDirection*=-1;
            aliens.forEach(a=>a.y+=20);
        }
        else{
            aliens.forEach(a=>a.x += alienDirection * deltaTime);
        }

        aliens.forEach(a=>{
            if(a.y+40>=player.y){
                gameOverReason="The invaders reached Earth!";
                gameState="gameover";
            }
        });

        if(aliens.length===0){
            gameOverReason="You defeated all the invaders!";
            gameState="win";
        }

        ctx.fillStyle="white";
        ctx.textAlign="left";
        ctx.font="20px Arial";
        ctx.fillText("Score: "+score,10,25);

        for(let i=0;i<lives;i++){
            ctx.drawImage(playerImg,W-40*(i+1),5,30,30);
        }

        player.draw();

        aliens.forEach(a=>a.draw());
        bullets.forEach(b=>b.draw());
        alienBullets.forEach(b=>b.draw());

        explosions.forEach((e,i)=>{
            e.draw();
            if(e.done()) explosions.splice(i,1);
        });
    }

    else if(gameState==="gameover"){

        ctx.fillStyle="black";
        ctx.fillRect(0,0,W,H);

        ctx.fillStyle="red";
        ctx.textAlign="center";

        ctx.font="60px Arial";
        ctx.fillText("GAME OVER",W/2,280);

        ctx.fillStyle="white";
        ctx.font="28px Arial";
        ctx.fillText(gameOverReason,W/2,340);

        ctx.font="26px Arial";
        ctx.fillText("Score: "+score,W/2,380);
        ctx.fillText("Press ENTER to Restart",W/2,430);

        if(keys["Enter"]) gameState="title";
    }

    else if(gameState==="win"){

        ctx.fillStyle="black";
        ctx.fillRect(0,0,W,H);

        ctx.fillStyle="green";
        ctx.textAlign="center";

        ctx.font="60px Arial";
        ctx.fillText("YOU WIN!",W/2,280);

        ctx.fillStyle="white";
        ctx.font="28px Arial";
        ctx.fillText(gameOverReason,W/2,340);

        ctx.font="26px Arial";
        ctx.fillText("Score: "+score,W/2,380);
        ctx.fillText("Press ENTER to Restart",W/2,430);

        if(keys["Enter"]) gameState="title";
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();