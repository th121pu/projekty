package sk.tuke.kpi.oop.game.controllers;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Input;
import sk.tuke.kpi.gamelib.KeyboardListener;
import sk.tuke.kpi.oop.game.Keeper;
import sk.tuke.kpi.oop.game.actions.Drop;
import sk.tuke.kpi.oop.game.actions.Shift;
import sk.tuke.kpi.oop.game.actions.Take;
import sk.tuke.kpi.oop.game.actions.Use;
import sk.tuke.kpi.oop.game.items.Usable;

public class KeeperController implements KeyboardListener {

    private Keeper keeper;

    public KeeperController(Keeper keeper) {
        this.keeper = keeper;
    }

    @Override
    public void keyPressed(@NotNull Input.Key key) {
        if (key == Input.Key.ENTER) {
            new Take<>().scheduleFor(keeper);
        }

        if (key == Input.Key.BACKSPACE) {
            new Drop<>().scheduleFor(keeper);
        }
        if (key == Input.Key.S) {
            new Shift<>().scheduleFor(keeper);
        }

        if (key == Input.Key.U && keeper.getScene().getActors().stream().filter(Usable.class::isInstance).filter(keeper::intersects).findFirst().orElse(null) != null) {
            new Use<>((Usable<?>)keeper.getScene().getActors().stream().filter(Usable.class::isInstance).filter(keeper::intersects).findFirst().orElse(null)).scheduleForIntersectingWith(keeper);
        }

        if (key == Input.Key.B && keeper.getBackpack().peek() != null && keeper.getBackpack().peek() instanceof Usable) {
               new Use<>((Usable<?>)keeper.getBackpack().peek()).scheduleForIntersectingWith(keeper);
        }

    }


}
