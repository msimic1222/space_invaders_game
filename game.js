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

let player; // all game objects and variables are declared here for easy access in all functions
let bullets;
let alienBullets;
let aliens;
let explosions;
let stars;

let score;
let lives;
let alienDirection;
let gameOverReason = "";

// CLASSES

class Star{ // class for the starry background, just for visual effect
    constructor(){
        this.x = Math.random()*W;
        this.y = Math.random()*H;
        this.size = Math.random()*2 + 1;
        this.speed = Math.random()*1 + 0.5;
    }

    move(){ // moves the star downwards to create a scrolling effect
        this.y += this.speed;

        if(this.y > H){
            this.y = 0;
            this.x = Math.random()*W;
        }
    }

    draw(){ // draws the star as a white square
        ctx.fillStyle="white";
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }
}

class Player{ // class for the player's spaceship 
    constructor(x,y){  // constructor takes initial x and y position of the player
        this.x=x;
        this.y=y;
        this.width=40;
        this.height=40;
        this.speed=6;
    }

    moveLeft(){ // method to move the player left, checks for boundaries to prevent moving off screen
        this.x-=this.speed;
        if(this.x<0) this.x=0;
    }

    moveRight(){ // method to move the player right, checks for boundaries to prevent moving off screen
        this.x+=this.speed;
        if(this.x+this.width>W)
            this.x=W-this.width;
    }

    draw(){ // method to draw the player's spaceship using the loaded image
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

    draw(){ // method to draw the alien invader using the loaded image
        ctx.drawImage(alienImg,this.x,this.y,this.width,this.height);
    }
}

class Bullet{ // class for the player's laser/bullet
    constructor(x,y){ // constructor, takes x and y position of the bullet
        this.x=x;
        this.y=y;
        this.width=16;
        this.height=32;
        this.speed=8;
    }

    move(){ // method to move bullet upwards 
        this.y-=this.speed;
    }

    draw(){ // draws the bullet using the loaded laser image
        ctx.drawImage(laserImg,this.x,this.y,this.width,this.height);
    }
}

class AlienBullet{ // class for alien's bullet, it is similar to player's, instead moving upwards
    constructor(x,y){ // constructor, takes x and y position of the alien bullet
        this.x=x;
        this.y=y;
        this.width=6;
        this.height=16;
        this.speed=4;
    }

    move(){ // method to move alien bullet downwards towards the player
        this.y+=this.speed;
    }

    draw(){ // draws alien bullet as red rectangle, didn't want to use image to differentiate from player 
        ctx.fillStyle="red";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

class Explosion{ // explosion class for when player/invader is hit 
    constructor(x,y){ // constructor takes x and y positions 
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

    player = new Player(380,520); // creates player object at the bottom center of the screen

    bullets=[]; // initializes arrays for bullets, alien bullets, aliens, explosions, and stars
    alienBullets=[];
    aliens=[];
    explosions=[];
    stars=[];

    score=0; // score starts at 0, lives start at 3, and alien direction starts moving right (positive)
    lives=3;

    alienDirection=2;

    for(let i=0;i<100;i++){ // for loop to create 100 stars for the background
        stars.push(new Star());
    }

    for(let r=0;r<3;r++){ // nested for loop to create aliens in grid pattern 
        for(let c=0;c<5;c++){
            aliens.push(new Alien(100+c*120,60+r*60));
        }
    }

    gameState="playing"; // gameState is set to "playing", start game, allow player to move/shoot
}

// INPUT CONTROLS

const keys={};

document.addEventListener("keydown",e=>{ // event listener for keydown

    keys[e.code]=true; // sets key code to true in keys object when pressed

    if(gameState==="title" && e.code==="Enter"){ // if on title screen and player presses Enter,
        startGame(); // start the game
    }

});

document.addEventListener("keyup",e=>{ // action listener for keyup
    keys[e.code]=false;
});

// GAME LOOP

function gameLoop(){ // main game loop, runs every frame using requestAnimationFrame

    ctx.clearRect(0,0,W,H); // clears the canvas for the next frame

    // STAR BACKGROUND

    if(stars){// if stars exist, move and draw them for the scrolling starry background effect
        stars.forEach(star=>{
            star.move();
            star.draw();
        });
    }

    if(gameState==="title"){ // if the state of the game is "title", display the title screen with game name and instructions to start 

        ctx.fillStyle="white";
        ctx.textAlign="center";

        ctx.font="60px Arial";
        ctx.fillText("SPACE INVADERS",W/2,250);

        ctx.font="30px Arial";
        ctx.fillText("Press ENTER to Start",W/2,320);
    }

    else if(gameState==="playing"){ // otherwise if game state is playing, run main game logicc for player movement

        if(keys["ArrowLeft"]) player.moveLeft(); // if left arrow key is pressed, move player left
        if(keys["ArrowRight"]) player.moveRight(); // if right arrow key is pressed, move player right

        if(keys["Space"] && bullets.length===0){ // if space key is pressed and there are no existing bullets on the screen, create a new bullet at the player's position
            bullets.push(new Bullet(player.x+16,player.y)); // fire bullet from center of player spaceship
        }

        bullets.forEach((b,i)=>{ // for each bullet, move upwards and when it goes off screen, remove from bullet array
            b.move();
            if(b.y<0) bullets.splice(i,1);
        });

        bullets.forEach((b,bi)=>{ // nested forEach loop to check for collisions between player bullets and alien, if detected, create explosion, remove alien and bullet, and increase score
            aliens.forEach((a,ai)=>{

                if( // collision detection between bullet and alien, found on github
                    b.x<a.x+a.width &&
                    b.x+b.width>a.x &&
                    b.y<a.y+a.height &&
                    b.y+b.height>a.y
                ){

                    explosions.push(new Explosion(a.x,a.y)); // create explosion at alien's position when hit

                    aliens.splice(ai,1); // delete alien and bullet from their respective arrays when hit
                    bullets.splice(bi,1);

                    score+=10; // increase score by 10 for each alien hit
                }

            });
        });

        if(Math.random()<0.02 && aliens.length>0){ // to make aliens shoot randomly 

            const shooter = aliens[Math.floor(Math.random()*aliens.length)];

            alienBullets.push( // create new alien bullet 
                new AlienBullet(shooter.x+20,shooter.y+40)
            );
        }

        alienBullets.forEach((b,i)=>{ // for each alien bullet, move downwards and if it goes off screen, remove from alienBullets array

            b.move();

            if(b.y>H) alienBullets.splice(i,1);

            if( // if alien bullet collides with player, remove bullet, decrease lives, and create explosion at player's position, if lives reach 0, end game with game over state
                b.x<player.x+player.width &&
                b.x+b.width>player.x &&
                b.y<player.y+player.height &&
                b.y+b.height>player.y
            ){

                alienBullets.splice(i,1);

                lives--;

                explosions.push(new Explosion(player.x,player.y));

                if(lives<=0){ // check if lives are 0
                    gameOverReason="You ran out of lives!";
                    gameState="gameover"; // make state "gameover" if player loses all lives
                }
            }

        });

        let alive = aliens.length;

if(alive > 0){

    let sign = Math.sign(alienDirection);

    // slower base speed and slower increase
    alienDirection = sign * (1.2 + (15 - alive) / 25);

    // lower maximum speed cap
    if(Math.abs(alienDirection) > 2.2)
        alienDirection = sign * 2.2;
}

        let hitEdge=false;

        aliens.forEach(a=>{ // for each alien, check if it hits the edge of the screen, if so, set hitEdge to true to reverse direction and move down
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
            aliens.forEach(a=>a.x+=alienDirection);
        }

        aliens.forEach(a=>{
            if(a.y+40>=player.y){ // if invaders reach player's level, end game with game over state 
                gameOverReason="The invaders reached Earth!";
                gameState="gameover";
            }
        });

        if(aliens.length===0){ // if no more invaders remaining, end game with win state
            gameOverReason="You defeated all the invaders!";
            gameState="win";
        }

        ctx.fillStyle="white";
        ctx.textAlign="left";
        ctx.font="20px Arial";
        ctx.fillText("Score: "+score,10,25);

        for(let i=0;i<lives;i++){ // draw remaining lives as player spaceship icons in the top right corner
            ctx.drawImage(playerImg,W-40*(i+1),5,30,30);
        }

        player.draw(); // draw player spaceship

        aliens.forEach(a=>a.draw()); // draw all aliens, bullets, alien bullets, and explosions
        bullets.forEach(b=>b.draw());
        alienBullets.forEach(b=>b.draw());

        explosions.forEach((e,i)=>{
            e.draw();
            if(e.done()) explosions.splice(i,1);
        });
    }

    else if(gameState==="gameover"){ // if gamestate is "gameover", display red "GAME OVER" text, the reason for game over, the player's final score, and instructions to restart the game by pressing Enter

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

    requestAnimationFrame(gameLoop); // request the next frame to keep the game loop running
}

gameLoop(); // start the game loop when the script loads