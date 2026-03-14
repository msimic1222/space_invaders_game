/**********************
Marko Simic
Space Invaders Game - COMP 2800
Swing implementation of player class
eventually implemented in javascript
**************************************/

import java.awt.Graphics;
import java.awt.Image;
import javax.swing.ImageIcon;

public class Player {

    int x;
    int y;

    int speed = 6;

    Image playerImage;

    public Player(int x, int y){
        this.x = x;
        this.y = y;

        // Load the player spaceship image
        playerImage = new ImageIcon("player.png").getImage();
    }

    public void moveLeft(){
        x -= speed;
        if(x < 0) x = 0; // prevent going off screen
    }

    public void moveRight(){
        x += speed;
        if(x > 760) x = 760; // assuming 800px window, 40px width ship
    }

    public void draw(Graphics g){
        // Draw the spaceship image
        g.drawImage(playerImage, x, y, getWidth(), getHeight(), null);
    }

    // Methods to get width/height for bullet alignment
    public int getWidth(){
        return 40; // match size drawn
    }

    public int getHeight(){
        return 40;
    }
}