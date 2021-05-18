package sk.tuke.kpi.oop.game.characters.bosses;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.oop.game.Movable;
import sk.tuke.kpi.oop.game.behaviours.Behaviour;
import sk.tuke.kpi.oop.game.characters.Alive;
import sk.tuke.kpi.oop.game.characters.Armed;
import sk.tuke.kpi.oop.game.characters.Health;
import sk.tuke.kpi.oop.game.patterns.State;
import sk.tuke.kpi.oop.game.weapons.BossGun;
import sk.tuke.kpi.oop.game.weapons.Firearm;

public class Boss extends AbstractActor implements Movable, Alive, Armed {
    private Behaviour<? super Boss> behaviour;
    private State currentState;
    private Health health;
    private int i;
    private Firearm gun;
    private int x;

    public Boss(int healthValue, Behaviour<? super Boss> behaviour) {
        //setAnimation(new Animation("sprites/monster_2.png", 78, 127, 0.1f, Animation.PlayMode.LOOP_PINGPONG));
        setAnimation(new Animation("sprites/alien2.png", 39, 64, 0.1f, Animation.PlayMode.LOOP_PINGPONG));
        health = new Health(healthValue);
        this.behaviour = behaviour;
        currentState =null;
        gun = new BossGun(280, 280);
        if (healthValue <= 300) i=1;
        else i=0;
    }


    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
        if (behaviour != null) behaviour.setUp(this);

        health.onExhaustion(() -> {
            getScene().removeActor(this);
        });


        new Loop<>(
            new Invoke<>(this::changeBoss)
        ).scheduleFor(this);


        new Loop<>(
            new ActionSequence<>(
            new Invoke<>(this::kill),
            new Wait<>(0.8f)
            )).scheduleFor(this);


    }

    public void kill() {
        if (currentState != null)
        currentState.kill(this);
    }

    private void changeBoss() {
        if (this.getHealth().getValue() <= 600 && this.getHealth().getValue() > 300 && i == 0) {
            System.out.println(this.getHealth().getValue());
            System.out.println("state1");
                currentState = new FullHealth(this);
                i++;
                x=0;
            }

            if (this.getHealth().getValue() <= 300 && i == 1) {
                System.out.println(this.getHealth().getValue());
                currentState = new HalfHealth(this);
                i++;
                x= 1;

            }
        }

    public void setCurrentState(State newState) {
        currentState = newState;
    }


    @Override
    public int getSpeed() {
        return 1;
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
}
