package sk.tuke.kpi.oop.game.weapons;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.oop.game.characters.Alive;
import sk.tuke.kpi.oop.game.characters.FireBurning;
import sk.tuke.kpi.oop.game.characters.FireCar;
import sk.tuke.kpi.oop.game.characters.Ripley;

import java.util.function.Predicate;

public class Bullet extends AbstractActor implements Fireable {
    private int speed;


    public Bullet() {
        speed = 5;
        toBullet();
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
        Alive shooter = (Alive) getScene().getActors().stream()
            .filter(FireCar.class::isInstance)
            .filter(actor1 -> intersects(actor1))
            .findFirst()
            .orElse(null);

    if (shooter != null) {
            toWater();
            Alive fire = (Alive) getScene().getActors().stream()
                .filter(FireBurning.class::isInstance)
                .filter(actor1 -> intersects(actor1))
                .findFirst()
                .orElse(null);
            if (fire != null) {
                fire.getHealth().drain(25);
                getScene().removeActor(this);
            }
        }

        else  {
            Alive actor = (Alive) getScene().getActors().stream()
                .filter(Alive.class::isInstance)
                .filter(actor1 -> intersects(actor1))
                .filter(Predicate.not(Ripley.class::isInstance))
                .filter(Predicate.not(FireCar.class::isInstance))
                .findFirst()
                .orElse(null);
            if (actor != null) {
                actor.getHealth().drain(25);
                getScene().removeActor(this);
            }
        }
    }
    public void toWater() {
        setAnimation(new Animation("sprites/energy_wave.png", 16, 16));
    }

    public void toBullet() {
        setAnimation(new Animation("sprites/bullet.png", 16, 16));
    }

    @Override
    public void collidedWithWall() {
        getScene().removeActor(this);
    }





}
