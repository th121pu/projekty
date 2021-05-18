package sk.tuke.gamestudio.game.BlockPuzzle.halgas;


import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import sk.tuke.gamestudio.game.BlockPuzzle.halgas.core.Field;
import sk.tuke.gamestudio.game.BlockPuzzle.halgas.core.Puzzle;
import sk.tuke.gamestudio.game.BlockPuzzle.halgas.core.PuzzleState;
import sk.tuke.gamestudio.game.BlockPuzzle.halgas.core.Tile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class PuzzleTest {

    private Field field;
    private Puzzle puzzle;
    private Puzzle puzzle2;


    public PuzzleTest() {
        field = new Field(4, 4);
       List<Integer> tiles = new ArrayList<Integer>();
        tiles.addAll(Arrays.asList(0, 2, 3, 4, 0, 6, 7, 8, 0, 0, 0, 0, 0, 0, 0, 0));
        puzzle = new Puzzle(4,4,tiles, 1 );
        puzzle2 = new Puzzle(4,4,tiles, 2);

    }

    @Test
    public void movePuzzleTesToStart() {
        puzzle.movePuzzle(field,0,0);
        printField();
            assertEquals(6,  field.countFullTiles(), "Puzzle was not moved to position (0,0) " +
                "a different amount of FULL tiles was counted in field");
    }

    @Test
    public void movePuzzleTesToLastColumn() {
        puzzle.movePuzzle(field,0,3);
        printField();
            assertEquals(0,  field.countFullTiles(), "Puzzle was moved to position (0,3) " +
                "a different amount of FULL tiles was counted in field");
    }


    @Test
    public void removePuzzleTesFromStart() {
        puzzle.movePuzzle(field,0,0);
        printField();
        System.out.println();
        puzzle.removePuzzle(field,0,0);
        printField();
            assertEquals(0,  field.countFullTiles(), "Puzzle was not removed from position (0,0) " +
                "a different amount of FULL tiles was counted in field");
    }

    @Test
    public void movePuzzleTesToTakenPosition() {
        puzzle.movePuzzle(field,0,0);
        printField();
        System.out.println();
        puzzle2.movePuzzle(field,0,0);
        printField();
        assertEquals(6,  field.countFullTiles(), "Puzzle was moved to position (0,0) which is already taken" +
                "a different amount of FULL tiles was counted in field");
    }

    @Test
    public void choosePuzzleTest() {
        puzzle.choosePuzzle(field);
        Assertions.assertEquals(PuzzleState.CHOSEN,  puzzle.getState(), "Puzzle was not chosen " +
                "a different puzzle state");
    }

    @Test
    public void chooseAnotherPuzzleTest() {
        field.getPuzzles().add(puzzle);
        field.getPuzzles().add(puzzle2);
        puzzle.choosePuzzle(field);
        puzzle2.choosePuzzle(field);
        assertEquals(PuzzleState.WAITING,  puzzle.getState(), "Puzzle is stil chosen" +
                "a different puzzle state");
    }


    public void printField() {
        for (int row = 0; row < field.getRowCount(); row++) {
            System.out.print((char) ('A' + row));
            System.out.print(" ");
            for (int column = 0; column < field.getColumnCount(); column++) {
                Tile tile = field.getTile(row, column);
                System.out.print(" ");
                switch (tile.getState()) {
                    case FULL:
                        System.out.print("X");
                        break;
                    case FREE:
                        System.out.print("-");
                        break;
                    default:
                        throw new IllegalArgumentException("Unexpected tile state " + tile.getState());
                }
            }
            System.out.println();
        }
    }

}
