/*********
Marko Simic
Space Invaders Game - COMP 2800
Swing implementation of explosion class
eventually implemented in javascript
*******************************/

import java.awt.*;
import javax.swing.ImageIcon;

public class Explosion {

    int x;
    int y;
    int timer = 20;

    Image explosionImage;

    public Explosion(int x,int y){

        this.x = x;
        this.y = y;

        explosionImage = new ImageIcon("explosion.png").getImage();
    }

    public void draw(Graphics g){

        g.drawImage(explosionImage,x,y,40,40,null);

        timer--;
    }

    public boolean finished(){

        return timer <= 0;
    }
}