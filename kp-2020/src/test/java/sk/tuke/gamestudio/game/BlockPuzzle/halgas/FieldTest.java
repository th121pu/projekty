package sk.tuke.gamestudio.game.BlockPuzzle.halgas;


import org.junit.jupiter.api.Test;
import sk.tuke.gamestudio.game.BlockPuzzle.halgas.core.Field;
import sk.tuke.gamestudio.game.BlockPuzzle.halgas.core.TileState;

import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class FieldTest {
    private Random randomGenerator = new Random();
    private Field field;
    private int rowCount;
    private int columnCount;
    private int tilesCount;


    public FieldTest() {
        rowCount = randomGenerator.nextInt(4) + 3;
        columnCount = randomGenerator.nextInt(7) + 4;
        tilesCount = rowCount*columnCount;
        field = new Field(rowCount, columnCount);
        System.out.println("Rows: " + rowCount);
        System.out.println("Cols: " + columnCount);
    }

    @Test
    public void checkIfPuzzlesCreated() {
        int puzzleTilesCounter = 0;
        for (int row = 0; row < rowCount; row++) {
            for (int col = 0; col < columnCount; col++) {
                if (field.getPuzzleTile(row, col) >= 0 && field.getPuzzleTile(row, col) < rowCount) {
                    puzzleTilesCounter++;
                    System.out.print(puzzleTilesCounter + " ");
                }
            }
        }

        assertEquals(tilesCount, puzzleTilesCounter, "Field was initialized incorrectly - " +
                "a different amount of puzzleTiles created was counted in the field than amount given in the constructor.");
    }

    @Test
    public void fieldStateStart() {
        int freeTilesCounter = 0;
        for (int row = 0; row < rowCount; row++) {
            for (int col = 0; col < columnCount; col++) {
                if (field.getTile(row, col).getState() == TileState.FREE) {
                    freeTilesCounter++;
                    System.out.print(freeTilesCounter + " ");
                }
            }
        }
        assertEquals(tilesCount, freeTilesCounter, "Field was initialized incorrectly - " +
                "a different amount of free Tiles created was counted in the field than amount given in the constructor.");
    }

}
