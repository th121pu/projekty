package sk.tuke.kpi.oop.game.characters;

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
//import sk.tuke.kpi.oop.game.patterns.Visitor;

import java.util.function.Predicate;

public class Alien extends AbstractActor implements  Alive, Movable, Enemy{

    private Health health;
    private Behaviour<? super Alien> behaviour;
  // private EnemyVisitor enemyVisitor;


    public Alien(int healthValue, Behaviour<? super Alien> behaviour) {
        this();
        health = new Health(healthValue);
        this.behaviour = behaviour;
       //enemyVisitor = new EnemyVisitor();

    }

    public Alien() {
        setAnimation(new Animation("sprites/alien.png", 32, 32, 0.1f, Animation.PlayMode.LOOP_PINGPONG));
        health = new Health(100);
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
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
        if (behaviour != null) behaviour.setUp(this);

        health.onExhaustion(() -> {
            getScene().removeActor(this);
        });



        /*
        new Loop<>(
            new ActionSequence<>(
                new Invoke<>(this::startKilling),
                new Wait<>(0.005f))
        ).scheduleFor(this);

         */
        findRipley();

    }

    public void findRipley() {
            new Loop<>(
                new ActionSequence<>(
                    new Invoke<>(this::touchAlive),
                    new Wait<>(0.005f))
            ).scheduleFor(this);
    }

    public void touchAlive() {
        Alive actor = (Alive) getScene().getActors().stream()
            .filter(Alive.class::isInstance)
            .filter(actor1 -> intersects(actor1))
            .filter(Predicate.not(Enemy.class::isInstance))
            .findFirst()
            .orElse(null);

        if (actor != null) {
            actor.getHealth().drain(1);
        }
    }




        public void startKilling() {
        //accept(enemyVisitor);
    }
    


    /*

    @Override
    public void accept(Visitor visitor) {
        visitor.killAlive(this);
    }

     */
}
