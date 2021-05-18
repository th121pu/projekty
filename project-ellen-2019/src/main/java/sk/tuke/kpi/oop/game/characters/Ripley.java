package sk.tuke.kpi.oop.game.characters;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Disposable;
import sk.tuke.kpi.gamelib.GameApplication;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.gamelib.actions.When;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.gamelib.messages.Topic;
import sk.tuke.kpi.oop.game.Direction;
import sk.tuke.kpi.oop.game.Keeper;
import sk.tuke.kpi.oop.game.Movable;
import sk.tuke.kpi.oop.game.items.Backpack;
import sk.tuke.kpi.oop.game.items.Shielded;
import sk.tuke.kpi.oop.game.weapons.Firearm;
import sk.tuke.kpi.oop.game.weapons.Gun;

public class Ripley extends AbstractActor implements Movable, Keeper, Alive, Armed, Shielded {
    private int speed;
    private Animation ani;
    private Backpack backpack;
    public static final Topic<Ripley> RIPLEY_DIED = Topic.create("ripley died", Ripley.class);
    private Disposable energyRepaired;
    private Health health;
    private Firearm gun;
    private boolean isShielded;


    public Ripley() {
        super("Ellen");
        speed = 2;
        gun = new Gun(10,80);
        ani = new Animation("sprites/player.png", 32, 32, 0.1f, Animation.PlayMode.LOOP_PINGPONG);
        setAnimation(ani);
        ani.stop();
        backpack = new Backpack("bo",10);
        health = new Health(100, 100);
        isShielded = false;
    }

    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
        health.onExhaustion(() -> {
            this.setAnimation(new Animation("sprites/player_die.png", 32, 32, 0.1f, Animation.PlayMode.ONCE));
            getScene().getMessageBus().publish(RIPLEY_DIED, this);
        });
        new Loop<>(
            new Invoke<>(this::restore)
        ).scheduleFor(this);
    }

    public void showRipleyState() {
        int windowHeight = getScene().getGame().getWindowSetup().getHeight();
        int yTextPos = windowHeight - GameApplication.STATUS_LINE_OFFSET;
        if (!isShielded)
            getScene().getGame().getOverlay().drawText("energy " +this.getHealth().getValue(), 300, yTextPos);
        else
            getScene().getGame().getOverlay().drawText("energy 100" , 300, yTextPos);

        getScene().getGame().getOverlay().drawText("ammo " +this.getFirearm().getAmmo(), 450, yTextPos);
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
    public Backpack getBackpack() {
        return backpack;
    }

    public Disposable getEnergyRepaired() {
        return energyRepaired;
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

    public void energyDown() {
        this.getHealth().drain(5);
        if (this.getHealth().getValue() <= 0) {
            this.getHealth().exhaust();
            this.setAnimation(new Animation("sprites/player_die.png", 32, 32, 0.1f, Animation.PlayMode.ONCE));
            getScene().getMessageBus().publish(RIPLEY_DIED, this);
        }
    }

    public void lowerEnergy() {
        energyRepaired =
        new Loop<>(
            new When<>(() -> (this.getHealth().getValue() > 0),
                new ActionSequence<>(
                    new Invoke<>(this::energyDown),
                    new Wait<>(0.5f)
                ))
        ).scheduleFor(this);
    }

    public void shieldOn() {
        isShielded = true;
       setAnimation(new Animation("sprites/player_shield.png", 32, 32));
    }

    public void restore() {
        if (isShielded)  {
            this.getHealth().restore();
        }
    }

    public void shieldOff() {
        isShielded = false;
        setAnimation(ani);
    }


}
