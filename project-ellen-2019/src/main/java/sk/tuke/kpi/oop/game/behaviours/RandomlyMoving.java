package sk.tuke.kpi.oop.game.behaviours;

import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.oop.game.Direction;
import sk.tuke.kpi.oop.game.Movable;
import sk.tuke.kpi.oop.game.actions.Move;

import java.util.Random;

public class RandomlyMoving implements Behaviour<Movable> {

    private Movable actor;

    @Override
    public void setUp(Movable actor) {
        if (actor ==null) return;
        this.actor = actor;
        Random rand = new Random();
        new Loop<>(
            new ActionSequence<>(
                new Invoke<>(this::moveRandomly),
                new Wait<>(rand.nextInt(4)+1))
        ).scheduleFor(actor);

    }

    public RandomlyMoving getMove() {
        return this;
    }



    public void moveRandomly() {
        if (actor != null) {
            Random rand = new Random();
            int dx= 0;
            int dy = 0;
            while (dx == 0 && dy == 0) {
                dx = rand.nextInt(2 + 1) - 1;
                dy = rand.nextInt(2 + 1) - 1;
            }
            Direction nova = Direction.convert(dx, dy);
            actor.getAnimation().setRotation(nova.getAngle());
            new Move<>(nova, rand.nextInt(1) + 1).scheduleFor(actor);
        }
    }





}
