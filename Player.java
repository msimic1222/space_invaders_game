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

    int width = 40;
    int height = 40;

    int speed = 6;

    Image playerImage;

    public Player(int x,int y){

        this.x = x;
        this.y = y;

        playerImage = new ImageIcon("player.png").getImage();
    }

    public void moveLeft(){

        x -= speed;

        if(x < 0)
            x = 0;
    }

    public void moveRight(){

        x += speed;

        if(x + width > 800)
            x = 800 - width;
    }

    public void draw(Graphics g){

        g.drawImage(playerImage,x,y,width,height,null);
    }
}