package sk.tuke.kpi.oop.game.characters;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.oop.game.patterns.EnemyVisitor;
import sk.tuke.kpi.oop.game.patterns.Visitor;

public class FireBurning extends AbstractActor implements Alive, Enemy{

    private Health health;
    private EnemyVisitor enemyVisitor;

    public FireBurning() {
        enemyVisitor = new EnemyVisitor();
        health = new Health(300);
        setAnimation(new Animation("sprites/fire.png", 64, 64, 0.1f, Animation.PlayMode.LOOP_PINGPONG));
    }

    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
        health.onExhaustion(() -> {
            getScene().removeActor(this);
        });

            new Loop<>(
                new ActionSequence<>(
                    new Invoke<>(this::startKilling),
                    new Wait<>(0.005f))
        ).scheduleFor(this);

    }

    public void startKilling() {
        accept(enemyVisitor);
    }

    @Override
    public Health getHealth() {
        return health;
    }

   // @Override
    public void accept(Visitor visitor) {
        visitor.killAlive(this);
    }


}
