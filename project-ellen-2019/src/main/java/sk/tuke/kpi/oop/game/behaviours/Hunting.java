package sk.tuke.kpi.oop.game.behaviours;

import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.oop.game.Direction;
import sk.tuke.kpi.oop.game.Movable;
import sk.tuke.kpi.oop.game.actions.Move;
import sk.tuke.kpi.oop.game.characters.Hunter;
import sk.tuke.kpi.oop.game.characters.Ripley;

public class Hunting implements Behaviour<Movable> {

    private Movable actor;

    @Override
    public void setUp(Movable actor) {
        if (actor ==null) return;
        this.actor = actor;
        new Loop<>(
            new ActionSequence<>(
                new Invoke<>(this::followRipley),
                new Wait<>(0.1f))
        ).scheduleFor(actor);
    }

    public void followRipley() {

        if (actor != null && !(actor instanceof Hunter)) {
            Ripley ripley = actor.getScene().getLastActorByType(Ripley.class);

            if (ripley.getPosX() < actor.getPosX() && ripley.getPosY() < actor.getPosY()) {
                actor.getAnimation().setRotation(Direction.SOUTHWEST.getAngle());
                new Move<>(Direction.SOUTHWEST, 0.1f).scheduleFor(actor);
            }

            else if (ripley.getPosX() < actor.getPosX() && ripley.getPosY() == actor.getPosY()) {
                actor.getAnimation().setRotation(Direction.WEST.getAngle());
                new Move<>(Direction.WEST, 0.1f).scheduleFor(actor);
            }
            else if (ripley.getPosX() > actor.getPosX() && ripley.getPosY() < actor.getPosY()) {
                actor.getAnimation().setRotation(Direction.SOUTHEAST.getAngle());
                new Move<>(Direction.SOUTHEAST, 0.1f).scheduleFor(actor);
            }
             else if (ripley.getPosX() > actor.getPosX() && ripley.getPosY() == actor.getPosY()) {
                actor.getAnimation().setRotation(Direction.EAST.getAngle());
                new Move<>(Direction.EAST, 0.1f).scheduleFor(actor);
            }

            else if (ripley.getPosY() < actor.getPosY() && ripley.getPosX() == actor.getPosX()) {
                actor.getAnimation().setRotation(Direction.SOUTH.getAngle());
                new Move<>(Direction.SOUTH, 0.1f).scheduleFor(actor);
            }
            else if (ripley.getPosY() >  actor.getPosY() && ripley.getPosX() == actor.getPosX()) {
                actor.getAnimation().setRotation(Direction.NORTH.getAngle());
                new Move<>(Direction.NORTH, 0.1f).scheduleFor(actor);
            }

            else if (ripley.getPosX() < actor.getPosX() && ripley.getPosY() > actor.getPosY()) {
                actor.getAnimation().setRotation(Direction.NORTHWEST.getAngle());
                new Move<>(Direction.NORTHWEST, 0.1f).scheduleFor(actor);
            }

            else if (ripley.getPosX() > actor.getPosX() && ripley.getPosY() > actor.getPosY()) {
                actor.getAnimation().setRotation(Direction.NORTHEAST.getAngle());
                new Move<>(Direction.NORTHEAST, 0.1f).scheduleFor(actor);
            }

        }
        else {
            Ripley ripley = actor.getScene().getLastActorByType(Ripley.class);
            if (ripley.getPosX() < actor.getPosX()) {
                new Move<>(Direction.WEST, 0.1f).scheduleFor(actor);
                //actor.setPosition(actor.getPosX() -1, actor.getPosY());
            }
            else if (ripley.getPosX() != actor.getPosX()) {
                new Move<>(Direction.EAST, 0.1f).scheduleFor(actor);
            }

            if (ripley.getPosY() < actor.getPosY()) {
                new Move<>(Direction.SOUTH, 0.1f).scheduleFor(actor);
            }
            else if (ripley.getPosY() !=  actor.getPosY()) {
                new Move<>(Direction.NORTH, 0.1f).scheduleFor(actor);
            }
        }

    }


}
