package sk.tuke.kpi.oop.game;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Disposable;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.gamelib.framework.actions.Loop;

public class DefectiveLight extends Light implements Repairable {

private Disposable change;


    public  DefectiveLight() {
   super();
    }



    private void brokenLight() {
        int rand =  (int) (Math.random() * 20);
        if (rand == 1) {
            toggle();
        }
    }

    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
        again();
    }

    private void again() {
        this.change= new Loop<>(new Invoke<>(this::brokenLight)).scheduleFor(this);
    }

    @Override
    public boolean repair() {
        if (this.change != null) {
            this.change.dispose();
            this.change = null;
            new ActionSequence<>(
                new Wait<>(10),
                new Invoke<>(this::again)
            ).scheduleFor(this);
            return true;
        }
        return false;
    }
}
