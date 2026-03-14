/********************
Marko Simic
Space Invaders Game - COMP 2800
Swing implementation of alien class
eventually implemented in javascript
**********************************/

import java.awt.*;
import javax.swing.ImageIcon;

public class Alien {

    int x;
    int y;

    Image alienImage;

    public Alien(int x, int y){

        this.x = x;
        this.y = y;

        alienImage = new ImageIcon("alien.png").getImage();
    }

    public void draw(Graphics g){

        g.drawImage(alienImage, x, y, 40, 40, null);

    }
}