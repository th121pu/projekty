package sk.tuke.gamestudio.game.BlockPuzzle.halgas.core;

public class LevelGenerator {
    int levelNumber;

    public LevelGenerator(int levelNumber) {
        this.levelNumber = levelNumber;
    }

    public int generateRowCount() {
        if (levelNumber == 1 || levelNumber == 2) return 3;
        if (levelNumber == 3 || levelNumber == 4 || levelNumber == 5) return 4;
        if (levelNumber == 9 || levelNumber == 10) return 6;
        return 5;
    }

    public int generateColCount() {
        if (levelNumber == 1) return 4;
        if (levelNumber == 2 || levelNumber == 3) return 5;
        if (levelNumber == 4 || levelNumber == 6) return 6;
        if (levelNumber == 8 || levelNumber == 9) return 8;
        if (levelNumber == 10) return 9;
        return 7;
    }

}
