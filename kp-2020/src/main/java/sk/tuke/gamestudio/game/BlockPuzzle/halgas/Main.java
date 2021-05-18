package sk.tuke.gamestudio.game.BlockPuzzle.halgas;


import sk.tuke.gamestudio.game.BlockPuzzle.halgas.consoleUI.ConsoleColors;
import sk.tuke.gamestudio.game.BlockPuzzle.halgas.consoleUI.ConsoleUI;
import sk.tuke.gamestudio.game.BlockPuzzle.halgas.core.Field;

import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int rowCount = 5;
        int colCount = 6;
        System.out.print(ConsoleColors.BLACK + ConsoleColors.RED_BACKGROUND + " Enter nubmer of rows(3-6): " + ConsoleColors.RESET + " ");
        int input = scanner.nextInt();
        if (input >= 3 && input <= 6) {
            rowCount = input;
        }
        System.out.println(ConsoleColors.RESET);
        System.out.print(ConsoleColors.BLACK + ConsoleColors.RED_BACKGROUND + " Enter nubmer of colums(4-10): " + ConsoleColors.RESET + " ");
        input = scanner.nextInt();
        if (input >= 4 && input <= 10) {
            colCount = input;
        }
        System.out.println(ConsoleColors.RESET);


        Field field = new Field(rowCount, colCount);
        ConsoleUI consoleUI = new ConsoleUI(field);
        consoleUI.play();
    }


}
