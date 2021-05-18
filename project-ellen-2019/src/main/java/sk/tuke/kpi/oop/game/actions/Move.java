package sk.tuke.kpi.oop.game.actions;

import org.jetbrains.annotations.Nullable;
import sk.tuke.kpi.gamelib.actions.Action;
import sk.tuke.kpi.oop.game.Direction;
import sk.tuke.kpi.oop.game.Movable;
import sk.tuke.kpi.oop.game.characters.Alive;
import sk.tuke.kpi.oop.game.characters.Hunter;

public class Move <M extends Movable> implements Action<M> {
    private M actor;
    private Direction direction;
    private float duration;
    private int i;
    private boolean done;

    public Move(Direction direction, float duration) {
        this.duration = duration;
        this.direction = direction;
        done = false;
        i= 0;
    }

    public Move(Direction direction) {
        this.direction = direction;
        done = false;
        i = 0;
    }

    @Override
    public boolean isDone() {
        return done;
    }

    @Override
    public void reset() {
       actor.stoppedMoving();
        duration= 0;
        i = 0;
        done= false;
    }


    @Nullable
    @Override
    public M getActor() {
        return actor;
    }

    @Override
    public void setActor(M movable) {
        this.actor = movable;
    }

    @Override
    public void execute(float deltaTime) {

            this.i++;
            if (i == 1 && done == false) {
                actor.startedMoving(this.direction);
                i++;
            }

            duration -= deltaTime;
            if (duration > 0 && actor != null) {
                    switcher();

                Alive hunter = (Hunter) getActor().getScene().getActors().stream()
                    .filter(Hunter.class::isInstance)
                    .filter(getActor()::intersects)
                    .filter(actor1 -> actor1 != getActor())
                    .findFirst()
                    .orElse(null);

                    if (getActor().getScene().getMap().intersectsWithWall(actor) || (getActor() instanceof Hunter && hunter != null)) {
                        getActor().collidedWithWall();
                        if (getActor() != null) {
                            int newDx = actor.getPosX() - direction.getDx() * actor.getSpeed();
                            int newDy = actor.getPosY() - direction.getDy() * actor.getSpeed();
                            actor.setPosition(newDx, newDy);
                        }
                    }


            } else {
                stop();
            }
    }

    public void switcher() {

            switch (direction) {
                case NORTH:
                    actor.setPosition(actor.getPosX(), actor.getPosY() + actor.getSpeed());
                    break;
                case NORTHEAST:
                    actor.setPosition(actor.getPosX() + actor.getSpeed(), actor.getPosY() + actor.getSpeed());
                    break;
                case NORTHWEST:
                    actor.setPosition(actor.getPosX() - actor.getSpeed(), actor.getPosY() + actor.getSpeed());
                    break;
                case SOUTH:
                    actor.setPosition(actor.getPosX(), actor.getPosY() - actor.getSpeed());
                    break;
                case SOUTHEAST:
                    actor.setPosition(actor.getPosX() + actor.getSpeed(), actor.getPosY() - actor.getSpeed());
                    break;
                case SOUTHWEST:
                    actor.setPosition(actor.getPosX() - actor.getSpeed(), actor.getPosY() - actor.getSpeed());
                    break;
                case EAST:
                    actor.setPosition(actor.getPosX() + actor.getSpeed(), actor.getPosY());
                    break;
                case WEST:
                    actor.setPosition(actor.getPosX() - actor.getSpeed(), actor.getPosY());
                    break;
                default:
                    break;
            }

        }


    public void stop() {
        if (actor != null) {
            actor.stoppedMoving();
            done = true;
            i++;
        }
    }

}
