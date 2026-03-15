/***************
Marko Simic
Space Invaders Game - COMP 2800
JavaScript version of the entire game, and the main file to run the game in a browser.
*****************************************************************************/


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

class Alien{ // constructor for the alien invaders, takes x and y parameters
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

    draw(){ // draw 
        ctx.drawImage(explosionImg,this.x,this.y,40,40);
        this.timer--;
    }

    done(){ // check if done 
        return this.timer<=0;
    }
}

// START GAME 

function startGame(){ // function to start the game 

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

    for(let r=0;r<4;r++){ // nested for loop to create aliens in grid pattern 
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

let lastTime = 0;

function gameLoop(timeStamp){ // function for gameLoop 

    const deltaTime = (timeStamp - lastTime) / 16.67; // delta time to ensure that program runs at same speed on all devices 
    lastTime = timeStamp;

    ctx.clearRect(0,0,W,H);

    // STAR BACKGROUND

    if(stars){ // drawing stars in background and moving 
        stars.forEach(star=>{
            star.y += star.speed * deltaTime;

            if(star.y > H){
                star.y = 0;
                star.x = Math.random()*W;
            }

            star.draw();
        });
    }

    if(gameState==="title"){ // if the game state is title, print the title screen

        ctx.fillStyle="white";
        ctx.textAlign="center";

        ctx.font="60px Arial";
        ctx.fillText("SPACE INVADERS",W/2,250);

        ctx.font="30px Arial";
        ctx.fillText("Press ENTER to Start",W/2,320);
    }

    else if(gameState==="playing"){ // if game state is playing, set controls for player movement, bullet firing

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

                if( // collision detection for bullets and alien invaders, found on github 
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

        if(Math.random()<0.003 && aliens.length>0){ // if statement to handle alien invader bullets

            const shooter = aliens[Math.floor(Math.random()*aliens.length)];

            alienBullets.push( // push bullets for as long as the conditions remains true 
                new AlienBullet(shooter.x+20,shooter.y+40)
            );
        }

        alienBullets.forEach((b,i)=>{ // alien bullets 

            b.y += b.speed * deltaTime;

            if(b.y>H) alienBullets.splice(i,1);

            if( // collision detection with the player's spaceship 
                b.x<player.x+player.width &&
                b.x+b.width>player.x &&
                b.y<player.y+player.height &&
                b.y+b.height>player.y
            ){

                alienBullets.splice(i,1); // remove alien bullets 

                lives--; // decrement player lives 

                explosions.push(new Explosion(player.x,player.y));

                if(lives<=0){ // check if player has ran out of lives, if so, display message, and set gameState to gameover
                    gameOverReason="You ran out of lives!";
                    gameState="gameover";
                }
            }

        });

        let alive = aliens.length;

        if(alive > 0){ // if aliens are still alive

            let sign = Math.sign(alienDirection);

            alienDirection = sign * (1.6 + (20 - alive) / 6); // controls acceleration of aliens (as they get hit, speed increases)

            if(Math.abs(alienDirection) > 8)
                alienDirection = sign * 8;
        }

        let hitEdge=false; // initialize hitEdge to false 

        aliens.forEach(a=>{
            if( // checks if any alien has hit the edge of the screen, if so,
                a.x+alienDirection<0 ||
                a.x+a.width+alienDirection>W
            ){
                hitEdge=true; // hitEdge to true
            }
        });

        if(hitEdge){ // if any alien hits edge of the screen, they all move down and reverse direction
            alienDirection*=-1;
            aliens.forEach(a=>a.y+=20);
        }
        else{ // if no aliens hit the edge, move horizontally in current direction
            aliens.forEach(a=>a.x += alienDirection * deltaTime);
        }

        aliens.forEach(a=>{ // check if an any alien reaches the player's level, if so, game is over 
            if(a.y+40>=player.y){
                gameOverReason="The invaders reached Earth!";
                gameState="gameover";
            }
        });

        if(aliens.length===0){ // if all aliens are gone, player wins, display win mesasage
            gameOverReason="You defeated all the invaders!";
            gameState="win";
        }

        ctx.fillStyle="white";
        ctx.textAlign="left";
        ctx.font="20px Arial";
        ctx.fillText("Score: "+score,10,25);

        for(let i=0;i<lives;i++){ // draws player lives as small spaceship icons in the top right corner 
            ctx.drawImage(playerImg,W-40*(i+1),5,30,30);
        }

        player.draw();

        aliens.forEach(a=>a.draw()); // draws all aliens, bullets, alien bullets, and explosions 
        bullets.forEach(b=>b.draw());
        alienBullets.forEach(b=>b.draw());

        explosions.forEach((e,i)=>{ // draws explosions and removes them after timer runs out 
            e.draw();
            if(e.done()) explosions.splice(i,1);
        });
    }

    else if(gameState==="gameover"){ // game over screen

        ctx.fillStyle="black";
        ctx.fillRect(0,0,W,H);

        ctx.fillStyle="red"; // red text 
        ctx.textAlign="center";

        ctx.font="60px Arial";
        ctx.fillText("GAME OVER",W/2,280); // game over message in red 

        ctx.fillStyle="white";
        ctx.font="28px Arial";
        ctx.fillText(gameOverReason,W/2,340); // display the reason the game is over 

        ctx.font="26px Arial";
        ctx.fillText("Score: "+score,W/2,380);
        ctx.fillText("Press ENTER to Restart",W/2,430);

        if(keys["Enter"]) gameState="title"; // if enter is pressed, gameState moves to title
    }

    else if(gameState==="win"){ // if gameState is win

        ctx.fillStyle="black";
        ctx.fillRect(0,0,W,H);

        ctx.fillStyle="green"; // green text 
        ctx.textAlign="center";

        ctx.font="60px Arial";
        ctx.fillText("YOU WIN!",W/2,280); // win message 

        ctx.fillStyle="white";
        ctx.font="28px Arial";
        ctx.fillText(gameOverReason,W/2,340);

        ctx.font="26px Arial";
        ctx.fillText("Score: "+score,W/2,380);
        ctx.fillText("Press ENTER to Restart",W/2,430);

        if(keys["Enter"]) gameState="title"; // if enter is pressed, gameState moves to title 
    }

    requestAnimationFrame(gameLoop);
}

gameLoop(); // start the game loop when the script loads