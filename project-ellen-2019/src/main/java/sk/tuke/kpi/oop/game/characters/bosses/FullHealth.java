package sk.tuke.kpi.oop.game.characters.bosses;

import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.oop.game.characters.Alive;
import sk.tuke.kpi.oop.game.characters.Enemy;
import sk.tuke.kpi.oop.game.patterns.State;

import java.util.function.Predicate;

public class FullHealth extends AbstractActor implements State {
    private Boss boss;

    public FullHealth(Boss boss) {
        this.boss = boss;
    }


    @Override
    public void kill(Boss boss) {
        boss.setCurrentState(this);
        Alive actor = (Alive) boss.getScene().getActors().stream()
            .filter(Alive.class::isInstance)
            .filter(boss::intersects)
            .filter(Predicate.not(Boss.class::isInstance))
            .filter(Predicate.not(Enemy.class::isInstance))
            .findFirst()
            .orElse(null);

        if (actor != null) {
            actor.getHealth().drain(10);
        }
    }
}
