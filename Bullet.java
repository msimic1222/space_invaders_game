/**************
Marko Simic
Space Invaders Game - COMP 2800
Swing implementation of bullet class
eventually implemented in javascript

***********************/

import java.awt.Graphics;
import java.awt.Image;
import javax.swing.ImageIcon;

public class Bullet {

    int x;
    int y;

    int width = 12;
    int height = 24;

    int speed = 8;

    Image laserImage;

    public Bullet(int x,int y){

        this.x = x;
        this.y = y;

        laserImage = new ImageIcon("laserbeam.png").getImage();
    }

    public void move(){

        y -= speed;
    }

    public void draw(Graphics g){

        g.drawImage(laserImage,x,y,width,height,null);
    }
}