/**************
Marko Simic
Space Invaders Game - COMP 2800
Swing implementation of bullet class
eventually implemented in javascript

***********************/

import java.awt.*;
import javax.swing.ImageIcon;

public class Bullet {

    int x;
    int y;
    int speed = 8;
    Image bulletImage;

    // constructor with image
    public Bullet(int x, int y, String imageFile) {
        this.x = x;
        this.y = y;
        bulletImage = new ImageIcon(imageFile).getImage();
    }

    // fallback constructor (white rectangle)
    public Bullet(int x, int y) {
        this.x = x;
        this.y = y;
        bulletImage = null;
    }

    public void move() {
        y -= speed;
    }

    public void draw(Graphics g) {
        if (bulletImage != null) {
            g.drawImage(bulletImage, x, y, 16, 32, null); // adjust size
        } else {
            g.setColor(Color.white);
            g.fillRect(x, y, 4, 10);
        }
    }
}