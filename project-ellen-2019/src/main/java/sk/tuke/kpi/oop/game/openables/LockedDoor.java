package sk.tuke.kpi.oop.game.openables;

import sk.tuke.kpi.gamelib.Actor;

public class LockedDoor extends Door {

    private boolean isLocked;

    public LockedDoor(String name, Orientation side) {
        super(name, side);
        isLocked= true;
    }

    /*
    private boolean isLocked() {
        if (isLocked) return true;
        else return false;
    }
     */

    public void lock() {
        isLocked = true;
        this.close();
    }

    public void unlock() {
        isLocked = false;
        this.open();
    }

    @Override
    public void useWith(Actor actor) {
     if (isLocked) return;
     super.useWith(actor);
    }

}
