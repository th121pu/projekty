package sk.tuke.gamestudio.game.BlockPuzzle.halgas.core;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Field {
    private final int rowCount;
    private final int columnCount;
    private final int puzzleCount;
    private final int puzzleSize;
    private final int tilesCount;
    private final int[][] puzzleTiles;
    private final Tile[][] tiles;
    private int score;
    private GameState state;
    private boolean repeat;
    private List<Puzzle> puzzles;
    private long startMillis;
    private int[][] currentField;

    public Field(int rowCount, int columnCount) {
        score = 1;
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.puzzleCount = rowCount;
        this.puzzleSize = columnCount;
        this.tilesCount = rowCount * columnCount;
        puzzleTiles = new int[rowCount][columnCount];
        currentField = new int[rowCount][columnCount];
        tiles = new Tile[rowCount][columnCount];
        state = GameState.PLAYING;
        generatePuzzles();
        makePuzzle();
        generateTiles();
    }

    public Tile getTile(int row, int column) {
        return tiles[row][column];
    }

    private void generateTiles() {
        for (int row = 0; row < rowCount; row++) {
            for (int column = 0; column < columnCount; column++) {
                tiles[row][column] = new Tile();
            }
        }
        startMillis = System.currentTimeMillis();
    }

    public boolean isSolved() {
        return getRowCount() * getColumnCount() == countFullTiles();
    }

    public GameState getState() {
        return state;
    }

    public void setState(GameState state) {
        this.state = state;
    }

    public int countFullTiles() {
        int fullTiles = 0;
        for (int row = 0; row < rowCount; row++) {
            for (int column = 0; column < columnCount; column++) {
                if (tiles[row][column].getState() == TileState.FULL) fullTiles++;
            }
        }
        return fullTiles;
    }

    public int getPuzzleTile(int row, int column) {
        return puzzleTiles[row][column];
    }

    public int getCurrentFieldTile(int row, int column) {
        return currentField[row][column];
    }

    public int setCurrentFieldTile(int value, int row, int column) {
        return currentField[row][column] = value;
    }

    public List<Puzzle> getPuzzles() {
        return puzzles;
    }

    private void makePuzzle() {
        puzzles = new ArrayList<>();
        puzzles.add(new Puzzle(getRowCount(), getColumnCount(), toPuzzle(0), 1));
        puzzles.add(new Puzzle(getRowCount(), getColumnCount(), toPuzzle(1), 2));
        puzzles.add(new Puzzle(getRowCount(), getColumnCount(), toPuzzle(2), 3));

        if (getPuzzleCount() >= 4) {
            puzzles.add(new Puzzle(getRowCount(), getColumnCount(), toPuzzle(3), 4));
        }
        if (getPuzzleCount() >= 5) {
            puzzles.add(new Puzzle(getRowCount(), getColumnCount(), toPuzzle(4), 5));
        }
        if (getPuzzleCount() >= 6) {
            puzzles.add(new Puzzle(getRowCount(), getColumnCount(), toPuzzle(5), 6));
        }
    }

    private List<Integer> toPuzzle(int number) {
        List<Integer> array = new ArrayList<>();
        int i = 0;
        for (int row = 0; row < getRowCount(); row++) {
            for (int col = 0; col < getColumnCount(); col++) {
                if (puzzleTiles[row][col] == number) {
                    array.add(i + 1);
                } else {
                    array.add(0);
                }
                i++;
            }
        }
        return array;
    }



    //nahodne generovanie hracieho pola a vytvorenie Puzzles
    private void generatePuzzles() {
        repeat = false;
        fillWithEmpty();
        fillStartingPoints();
        fillRest();

        while (repeat) {
            try {
                generatePuzzles();
            } catch (StackOverflowError e) {
                // System.out.println("generating");
                generatePuzzles();
            }
        }

        endGenerate();
    }

    //generovanie pola pokym nie je uspesne
    private void endGenerate() {
        findEmpty();

        while (notRight()) {
            generatePuzzles();
        }
    }

    //kontrola ci je vygenerovane pole spravne
    private boolean notRight() {
        for (int col = 0; col < this.getPuzzleSize(); col++) {
            for (int row = 0; row < this.getPuzzleCount(); row++) {
                if (puzzleTiles[row][col] < 0 || puzzleTiles[row][col] > this.getPuzzleCount() - 1) return true;
            }
        }
        return false;
    }

    //zaplnenie pola prazdnymi polickami
    private void fillWithEmpty() {
        for (int col = 0; col < this.getPuzzleSize(); col++) {
            for (int row = 0; row < this.getPuzzleCount(); row++) {
                puzzleTiles[row][col] = 9;
            }
        }
    }

    //vytvorenie zaciatocnej pozicie pre kazdu Puzzle
    private void fillStartingPoints() {
        Random random = new Random();
        for (int j = 0; j < this.getPuzzleCount(); j++) {
            int row = random.nextInt(getRowCount());
            int column = random.nextInt(getColumnCount());

            while (puzzleTiles[row][column] != 9 || !nextOneIsEmpty(row, column)) {
                row = random.nextInt(getRowCount());
                column = random.nextInt(getColumnCount());
            }
            puzzleTiles[row][column] = j;
        }
    }

    //kontrola ci su zaciatocne body puzzle od seba dostatocne vzdialene
    private boolean nextOneIsEmpty(int row, int column) {
        if (row != 0 && puzzleTiles[row - 1][column] == 9) {
            if (column != getColumnCount() - 1 && puzzleTiles[row][column + 1] == 9) {
                return true;
            }
        }
        return false;
    }

    //vytvorenie zvysku pre kazdu z puzzle
    private void fillRest() {
        Random random = new Random();
        for (int j = 0; j < 3; j++) {
            for (int i = 1; i < this.getPuzzleSize(); i++) {
                int row = random.nextInt(getRowCount());
                int column = random.nextInt(getColumnCount());
                int counter = 0;

                while (puzzleTiles[row][column] != 9 || !isConnected(row, column, j)) {
                    row = random.nextInt(getRowCount());
                    column = random.nextInt(getColumnCount());
                    counter++;
                    if (counter >= 15) {
                        repeat = true;
                        break;
                    }
                }
                puzzleTiles[row][column] = j;
            }
        }
    }

    //kontrola ci je nova pozicia Puzzle spojena s jej ostatnymi poziciami
    private boolean isConnected(int row, int column, int j) {
        if (row == 0 && column == 0) {
            if (puzzleTiles[row + 1][column] == j || puzzleTiles[row][column + 1] == j) return true;
        } else if (row == 0 && column == getColumnCount() - 1) {
            if (puzzleTiles[row + 1][column] == j || puzzleTiles[row][column - 1] == j) return true;
        } else if (row == getRowCount() - 1 && column == 0) {
            if (puzzleTiles[row - 1][column] == j || puzzleTiles[row][column + 1] == j) return true;
        } else if (row == 0) {
            if (puzzleTiles[row + 1][column] == j || puzzleTiles[row][column - 1] == j || puzzleTiles[row][column + 1] == j)
                return true;
        } else if (column == 0) {
            if (puzzleTiles[row - 1][column] == j || puzzleTiles[row + 1][column] == j || puzzleTiles[row][column + 1] == j)
                return true;
        } else if (row == getRowCount() - 1 && column == getColumnCount() - 1) {
            if (puzzleTiles[row - 1][column] == j || puzzleTiles[row][column - 1] == j) return true;
        } else if (row == getRowCount() - 1) {
            if (puzzleTiles[row - 1][column] == j || puzzleTiles[row][column - 1] == j || puzzleTiles[row][column + 1] == j)
                return true;
        } else if (column == getColumnCount() - 1) {
            if (puzzleTiles[row - 1][column] == j || puzzleTiles[row + 1][column] == j || puzzleTiles[row][column - 1] == j)
                return true;
        } else {
            if (puzzleTiles[row - 1][column] == j || puzzleTiles[row + 1][column] == j || puzzleTiles[row][column - 1] == j || puzzleTiles[row][column + 1] == j)
                return true;
        }
        return false;
    }


    private void findEmpty() {
        int counter = 0;
        while (counter <= 2) {
            for (int row = 0; row < getRowCount(); row++) {
                for (int col = 0; col < getColumnCount(); col++) {
                    if (puzzleTiles[row][col] == 9) {
                        findSmallestNeigb(row, col);
                    }
                }
            }
            counter++;
        }
    }

    private void findSmallestNeigb(int row, int column) {
        if (row == 0 && column == 0) {
            puzzleTiles[row][column] = countPuzzzle(puzzleTiles[row + 1][column], puzzleTiles[row][column + 1]);
        } else if (row == 0 && column == getColumnCount() - 1) {
            puzzleTiles[row][column] = countPuzzzle(puzzleTiles[row + 1][column], puzzleTiles[row][column - 1]);
        } else if (row == getRowCount() - 1 && column == 0) {
            puzzleTiles[row][column] = countPuzzzle(puzzleTiles[row - 1][column], puzzleTiles[row][column + 1]);
        } else if (row == 0) {
            puzzleTiles[row][column] = countPuzzzle(puzzleTiles[row + 1][column], puzzleTiles[row][column - 1], puzzleTiles[row][column + 1]);
        } else if (column == 0) {
            puzzleTiles[row][column] = countPuzzzle(puzzleTiles[row - 1][column], puzzleTiles[row + 1][column], puzzleTiles[row][column + 1]);
        } else if (row == getRowCount() - 1 && column == getColumnCount() - 1) {
            puzzleTiles[row][column] = countPuzzzle(puzzleTiles[row - 1][column], puzzleTiles[row][column - 1]);
        } else if (row == getRowCount() - 1) {
            puzzleTiles[row][column] = countPuzzzle(puzzleTiles[row - 1][column], puzzleTiles[row][column - 1], puzzleTiles[row][column + 1]);
        } else if (column == getColumnCount() - 1) {
            puzzleTiles[row][column] = countPuzzzle(puzzleTiles[row - 1][column], puzzleTiles[row + 1][column], puzzleTiles[row][column - 1]);
        } else {
            puzzleTiles[row][column] = countPuzzzle(puzzleTiles[row - 1][column], puzzleTiles[row + 1][column], puzzleTiles[row][column - 1], puzzleTiles[row][column + 1]);
        }
    }


    private int countPuzzzle(int a, int b) {
        if (a == 9) return b;
        if (b == 9) return a;
        if (count(a) <= count(b)) return a;
        else return b;
    }

    private int countPuzzzle(int a, int b, int c) {
        if (a == 9) countPuzzzle(b, c);
        if (b == 9) countPuzzzle(a, c);
        if (c == 9) countPuzzzle(a, b);
        int big = countPuzzzle(a, b);
        return countPuzzzle(big, c);
    }

    private int countPuzzzle(int a, int b, int c, int d) {
        if (a == 9) countPuzzzle(b, c, d);
        if (b == 9) countPuzzzle(a, c, d);
        if (c == 9) countPuzzzle(a, b, d);
        if (d == 9) countPuzzzle(a, b, c);
        int big = countPuzzzle(a, b, c);
        return countPuzzzle(big, d);
    }

    private int count(int a) {
        int sum = 0;
        for (int row = 0; row < getRowCount(); row++) {
            for (int col = 0; col < getColumnCount(); col++) {
                if (puzzleTiles[row][col] == a) {
                    sum++;
                }
            }
        }
        return sum;
    }


    public void hint(int hinted) {
        int[] toHint1 = {8, 0};
        int[] toHint2 = {8, 0};

        resetField();

        int[] hint1 = findHintStart(toHint1, 0);
        int[] hint2 = findHintStart(toHint2, 1);

        if (hinted == 0) {
            assert hint1 != null;
            getPuzzles().get(0).movePuzzle(this, hint1[0], hint1[1]);
        }

        if (hinted == 1) {
            assert hint1 != null;
            getPuzzles().get(0).movePuzzle(this, hint1[0], hint1[1]);
            assert hint2 != null;
            getPuzzles().get(1).movePuzzle(this, hint2[0], hint2[1]);
        }
    }

    public void resetField() {
        for (int i = 0; i < getPuzzles().size(); i++) {
            getPuzzles().get(i).setState(PuzzleState.WAITING);
        }

        for (int row = 0; row < rowCount; row++) {
            for (int column = 0; column < columnCount; column++) {
                getTile(row, column).setState(TileState.FREE);
            }
        }
    }

    private int[] findHintStart(int[] hint, int puzzleNumber) {
        for (int row = 0; row < rowCount; row++) {
            if (hint[0] != 8) break;
            for (int col = 0; col < columnCount; col++) {
                if (getPuzzleTile(row, col) == puzzleNumber) {
                    hint[0] = row;
                    hint[1] = col;
                    return hint;
                }
            }
        }
        return null;
    }

    public int getRowCount() {
        return rowCount;
    }

    public int getColumnCount() {
        return columnCount;
    }

    private int getPuzzleCount() {
        return puzzleCount;
    }


    private int getPuzzleSize() {
        return puzzleSize;
    }


    private int getPlayingTime() {
        return ((int) (System.currentTimeMillis() - startMillis)) / 1000;
    }

    public int getScore() {
        if (score != 0) {
            score = rowCount * columnCount * 3 - getPlayingTime();
        }
        if (score <= 0) score = 0;
        return score;
    }

    public void resetScore() {
        score = 0;
    }


}
