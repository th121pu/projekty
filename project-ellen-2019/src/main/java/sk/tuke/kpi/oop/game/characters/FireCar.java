package sk.tuke.kpi.oop.game.characters;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.gamelib.messages.Topic;
import sk.tuke.kpi.oop.game.Direction;
import sk.tuke.kpi.oop.game.Movable;
import sk.tuke.kpi.oop.game.weapons.Firearm;
import sk.tuke.kpi.oop.game.weapons.Gun;

public class FireCar extends AbstractActor implements Movable, Alive, Armed {
    private int speed;
    private Health health;
    private Firearm gun;
    public static final Topic<FireCar> CAR_STOP = Topic.create("car stop", FireCar.class);

    public FireCar() {
        super("Tank");
        setAnimation(new Animation("sprites/tank.png", 32, 32, 0.1f, Animation.PlayMode.LOOP_PINGPONG));
        speed = 2;
        gun = new Gun(80,80);
        health = new Health(100, 100);
    }

    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
        health.onExhaustion(() -> {
            getScene().removeActor(this);
            getScene().getMessageBus().publish(CAR_STOP, this);
        });
    }

    @Override
    public int getSpeed() {
        return this.speed;
    }

    @Override
    public Health getHealth() {
        return health;
    }

    @Override
    public Firearm getFirearm() {
        return gun;
    }

    @Override
    public void setFirearm(Firearm weapon) {
        gun = weapon;
    }

    @Override
    public void stoppedMoving() {
        getAnimation().stop();
    }

    @Override
    public void startedMoving(Direction direction) {
        getAnimation().setRotation(direction.getAngle());
        getAnimation().play();
    }
}
