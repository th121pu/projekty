package sk.tuke.gamestudio.game.BlockPuzzle.halgas.core;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Puzzle {
    private int rowCount;
    private int colCount;
    private List<Integer> tiles;
    private int order;
    private PuzzleState state;

    //creating new puzzle
    private int newRowCount;
    private int newColCount;
    private List<Integer> puzzleAfterRow;
    private List<Integer> puzzleAfterCol;
    private List<List<Integer>> finalPuzzle;

    //moving puzzle
    private int rowStart;
    private int colStart;

    public Puzzle(int rowCount, int columnCount, List<Integer> tiles, int order) {
        this.rowCount = rowCount;
        this.colCount = columnCount;
        this.tiles = tiles;
        this.order = order;
        this.setState(PuzzleState.WAITING);
        createPuzzle();
    }

    public List<List<Integer>> getFinalPuzzle() {
        return finalPuzzle;
    }

    public int getOrder() {
        return order;
    }

    public int getNewRowCount() {
        return newRowCount;
    }

    public int getNewColCount() {
        return newColCount;
    }

    public PuzzleState getState() {
        return state;
    }


    public void setState(PuzzleState state) {
        this.state = state;
    }

    private void placePuzzle() {
        this.setState(PuzzleState.PLACED);
    }

    public void choosePuzzle(Field field) {
        for (int i = 0; i < field.getPuzzles().size(); i++) {
            if (field.getPuzzles().get(i).getState() == PuzzleState.CHOSEN)
                field.getPuzzles().get(i).setState(PuzzleState.WAITING);
        }

        if (this.getState() == PuzzleState.PLACED) {
            removePuzzle(field, rowStart, colStart);
        }

        this.setState(PuzzleState.CHOSEN);
    }

    //pohyb puzzle
    public boolean movePuzzle(Field field, int rowStart, int colStart) {
        this.rowStart = rowStart;
        this.colStart = colStart;
        int offset = finalPuzzle.get(0).get(0);

        //kontrola ci sa dana puzzle zmesti do Fieldu podla zaciatocnej pozicie
        if (rowCount - rowStart < newRowCount || colCount - colStart < newColCount - offset || offset > colStart) {
            setState(PuzzleState.WAITING);
            return false;
        }

        //kontrola ci su dane Tiles FREE
        if (!areTilesFree(field, rowStart, colStart, offset)) {
            setState(PuzzleState.WAITING);
            return false;
        }

        //nastavenie tiles na FULL a nastavenie puzzle na PLACED
        makeTilesFull(field, rowStart, colStart, offset);
        placePuzzle();
        return true;
    }

    private boolean areTilesFree(Field field, int rowStart, int colStart, int offset) {
        for (int i = 0; i < finalPuzzle.size(); i++) {
            for (int j = 0; j < finalPuzzle.get(i).size(); j++) {
                int newCol = finalPuzzle.get(i).get(j) + colStart - offset;

                if (field.getTile(rowStart + i, newCol).getState() == TileState.FULL) {
                    return false;
                }
            }
        }
        return true;
    }

    private void makeTilesFull(Field field, int rowStart, int colStart, int offset) {
        for (int i = 0; i < finalPuzzle.size(); i++) {
            for (int j = 0; j < finalPuzzle.get(i).size(); j++) {
                int newCol = finalPuzzle.get(i).get(j) + colStart - offset;
                field.getTile(rowStart + i, newCol).setState(TileState.FULL);
                field.setCurrentFieldTile(this.order-1,rowStart + i, newCol);
            }
        }
    }

    //odstranenie puzzle, ak je vybrata (chosen)
    public void removePuzzle(Field field, int rowStart, int colStart) {
        if (this.getState() == PuzzleState.WAITING || this.getState() == PuzzleState.CHOSEN) return;
        int offset = finalPuzzle.get(0).get(0);
        //nastavenie tiles na FULL
        for (int i = 0; i < finalPuzzle.size(); i++) {
            for (int j = 0; j < finalPuzzle.get(i).size(); j++) {
                int newCol = finalPuzzle.get(i).get(j) + colStart - offset;
                field.getTile(rowStart + i, newCol).setState(TileState.FREE);
            }
        }
    }

    //vytvorenie puzzle
    private void createPuzzle() {
        //vymaz 0ky a zmensi hodnoty o 1
        tiles.removeAll(Arrays.asList(0));
        for (int i = 0; i < tiles.size(); i++) {
            tiles.set(i, tiles.get(i) - 1);
        }
        deleteRow();
        deleteCol();
        makeFinalPuzzle();
    }

    //vymazanie prazdnych riadkov
    private void deleteRow() {
        int index = 0;
        this.puzzleAfterRow = new ArrayList<>();
        this.newRowCount = 0;
        int puzzleIndex = 0;

        for (int row = 0; row < rowCount; row++) {
            List<Integer> oneRow = new ArrayList<>();

            //skontroluj riadok
            for (int col = 0; col < colCount; col++) {
                if (tiles.contains(index)) {
                    oneRow.add(1);
                } else {
                    oneRow.add(0);
                }
                index++;
            }

            //uloz novu puzzle bez prazdnych riadkov
            if (oneRow.contains(1)) {
                for (int i = 0; i < oneRow.size(); i++) {
                    if (oneRow.get(i) == 1) {
                        puzzleAfterRow.add(puzzleIndex);
                    }
                    puzzleIndex++;
                }
                newRowCount++;
            }
        }
    }

    //vymazanie prazdnych stlpcov
    private void deleteCol() {
        this.puzzleAfterCol = new ArrayList<>();
        this.newColCount = 0;
        int deletedCols = 0;

        for (int col = 0; col < colCount; col++) {
            int index = col;
            List<Integer> oneCol = new ArrayList<>();

            //skontroluj stlpec
            for (int row = 0; row < newRowCount; row++) {
                if (puzzleAfterRow.contains(index)) {
                    oneCol.add(1);
                } else {
                    oneCol.add(0);
                }
                index = index + colCount;
            }

            //uloz novu puzzle bez prazdnych stlpcov
            if (oneCol.contains(1)) {
                int puzzleIndex = newColCount;
                for (int i = 0; i < oneCol.size(); i++) {
                    if (oneCol.get(i) == 1) {
                        puzzleAfterCol.add(puzzleIndex);
                    }
                    puzzleIndex = puzzleIndex + colCount - deletedCols;
                }
                newColCount++;
            } else if (newColCount == 0) {
                deletedCols++;
            }
        }
        newColCount = colCount - deletedCols;
    }

    //vyvorenie pola s poziciami puzzle
    private void makeFinalPuzzle() {
        //vytvor 2d pole
        finalPuzzle = new ArrayList<>();
        for (int i = 0; i < newRowCount; i++) {
            finalPuzzle.add(new ArrayList<>());

            for (Integer integer : puzzleAfterCol) {
                if (integer / newColCount == i) {
                    int add = integer % newColCount;
                    finalPuzzle.get(i).add(add);
                }
            }
        }

        //spocitaj stlpce
        int temp = 0;
        for (Integer integer : puzzleAfterCol) {
            if (integer % newColCount > temp) {
                temp = integer % newColCount;
            }
        }
        newColCount = temp + 1;
    }
}
