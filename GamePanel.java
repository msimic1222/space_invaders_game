/*****************
Marko Simic
Space Invaders Game - COMP 2800
Swing implementation of game panel class, most important class that handles game logic and rendering
eventually implemented in javascript
***********************************************************************************/

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

public class GamePanel extends JPanel implements ActionListener,KeyListener{

    Timer timer;

    Player player;

    ArrayList<Alien> aliens = new ArrayList<>();
    ArrayList<Bullet> bullets = new ArrayList<>();
    ArrayList<Explosion> explosions = new ArrayList<>();

    boolean leftPressed=false;
    boolean rightPressed=false;

    int alienDirection = 2;

    int score = 0;
    int lives = 3;

    boolean gameOver=false;
    boolean win=false;

    String gameOverReason="";

    public GamePanel(){

        setBackground(Color.black);
        setFocusable(true);
        addKeyListener(this);

        timer = new Timer(20,this);
    }

    public void startGame(){

        player = new Player(380,520);

        aliens.clear();
        bullets.clear();
        explosions.clear();

        score=0;
        lives=3;

        alienDirection=2;

        gameOver=false;
        win=false;

        for(int r=0;r<3;r++){

            for(int c=0;c<5;c++){

                aliens.add(new Alien(100 + c*120,60 + r*60));

            }
        }

        timer.start();
    }

    public void actionPerformed(ActionEvent e){

        if(gameOver || win){

            repaint();
            return;
        }

        if(leftPressed)
            player.moveLeft();

        if(rightPressed)
            player.moveRight();

        for(int i=0;i<bullets.size();i++){

            Bullet b = bullets.get(i);

            b.move();

            if(b.y < 0)
                bullets.remove(i);
        }

        for(int i=0;i<bullets.size();i++){

            Bullet b = bullets.get(i);

            for(int j=0;j<aliens.size();j++){

                Alien a = aliens.get(j);

                if(b.x > a.x &&
                   b.x < a.x + 40 &&
                   b.y > a.y &&
                   b.y < a.y + 40){

                    explosions.add(new Explosion(a.x,a.y));

                    aliens.remove(j);
                    bullets.remove(i);

                    score += 10;

                    break;
                }
            }
        }

        int alive = aliens.size();

        if(alive > 0){

            int sign = alienDirection > 0 ? 1 : -1;

            alienDirection = sign * (2 + (15-alive)/4);

            if(Math.abs(alienDirection) > 6)
                alienDirection = sign * 6;
        }

        boolean hitEdge=false;

        for(Alien a : aliens){

            if(a.x + alienDirection < 0 ||
               a.x + 40 + alienDirection > 800){

                hitEdge=true;
            }
        }

        if(hitEdge){

            alienDirection = -alienDirection;

            for(Alien a : aliens){

                a.y += 20;

                if(a.y + 40 >= player.y){

                    gameOver=true;
                    gameOverReason="The invaders reached Earth!";
                }
            }

        }else{

            for(Alien a : aliens){

                a.x += alienDirection;
            }
        }

        if(aliens.size()==0){

            win=true;
            gameOverReason="You defeated all the invaders!";
        }

        repaint();
    }

    public void paintComponent(Graphics g){

        super.paintComponent(g);

        g.setColor(Color.white);
        g.setFont(new Font("Arial",Font.PLAIN,20));
        g.drawString("Score: " + score,10,20);

        for(int i=0;i<lives;i++){

            g.drawImage(player.playerImage,740 - i*40,5,30,30,null);
        }

        if(!gameOver && !win){

            player.draw(g);

            for(Alien a : aliens)
                a.draw(g);

            for(Bullet b : bullets)
                b.draw(g);

            for(int i=0;i<explosions.size();i++){

                Explosion ex = explosions.get(i);

                ex.draw(g);

                if(ex.finished())
                    explosions.remove(i);
            }

        }

        if(gameOver){

            g.setColor(Color.red);
            g.setFont(new Font("Arial",Font.BOLD,50));
            g.drawString("GAME OVER",250,250);

            g.setColor(Color.white);
            g.setFont(new Font("Arial",Font.PLAIN,25));
            g.drawString(gameOverReason,220,300);

            g.drawString("Press SPACE to Restart",230,350);
        }

        if(win){

            g.setColor(Color.green);
            g.setFont(new Font("Arial",Font.BOLD,50));
            g.drawString("YOU WIN!",270,250);

            g.setColor(Color.white);
            g.setFont(new Font("Arial",Font.PLAIN,25));
            g.drawString(gameOverReason,200,300);

            g.drawString("Press SPACE to Restart",230,350);
        }
    }

    public void keyPressed(KeyEvent e){

        if(e.getKeyCode()==KeyEvent.VK_LEFT)
            leftPressed=true;

        if(e.getKeyCode()==KeyEvent.VK_RIGHT)
            rightPressed=true;

        if(e.getKeyCode()==KeyEvent.VK_SPACE){

            if(gameOver || win){

                startGame();
                return;
            }

            if(bullets.size()==0){

                bullets.add(new Bullet(player.x + 15,player.y));
            }
        }
    }

    public void keyReleased(KeyEvent e){

        if(e.getKeyCode()==KeyEvent.VK_LEFT)
            leftPressed=false;

        if(e.getKeyCode()==KeyEvent.VK_RIGHT)
            rightPressed=false;
    }

    public void keyTyped(KeyEvent e){}
}