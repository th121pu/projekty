package sk.tuke.kpi.oop.game.weapons;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.oop.game.characters.Alive;
import sk.tuke.kpi.oop.game.characters.Ripley;
import sk.tuke.kpi.oop.game.characters.bosses.Boss;

import java.util.function.Predicate;

public class BossBullet extends AbstractActor implements Fireable{

    private int speed;


    public BossBullet() {
        speed = 5;
        setAnimation(new Animation("sprites/bullet.png", 16, 16));
    }


    @Override
    public int getSpeed() {
        return speed;
    }


    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
        new Loop<>(
            new Invoke<>(this::shot)
        ).scheduleFor(this);
    }


    public void shot() {

        Alive actor = (Alive) getScene().getActors().stream()
            .filter(Alive.class::isInstance)
            .filter(actor1 -> intersects(actor1))
            .filter(Predicate.not(Boss.class::isInstance))
            .filter(Ripley.class::isInstance)
            .findFirst()
            .orElse(null);
        if (actor != null) {
            actor.getHealth().drain(15);
            getScene().removeActor(this);
        }
    }



    @Override
    public void collidedWithWall() {
        getScene().removeActor(this);
    }

}

