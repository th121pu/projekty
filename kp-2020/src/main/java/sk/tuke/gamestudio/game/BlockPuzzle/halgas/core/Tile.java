package sk.tuke.gamestudio.game.BlockPuzzle.halgas.core;


public  class Tile {
    private TileState state;

    public Tile() {
    state = TileState.FREE;
    }

    public TileState getState() {
        return state;
    }

    void setState(TileState state) {
        this.state = state;
    }
}
