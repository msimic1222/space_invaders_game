/***********************
Marko Simic
Space Invaders Game - COMP 2800
Main class to launch game, create JFrame, and start game loop
eventually implemented in javascript
***********************************************************/


import javax.swing.JFrame;

public class Main {

    public static void main(String[] args) {

        JFrame window = new JFrame("Space Invaders");

        GamePanel panel = new GamePanel();

        window.add(panel);
        window.setSize(800,600);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setResizable(false);
        window.setVisible(true);

        panel.startGame();
    }
}