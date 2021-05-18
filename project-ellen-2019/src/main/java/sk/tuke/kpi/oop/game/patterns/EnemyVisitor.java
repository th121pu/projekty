package sk.tuke.kpi.oop.game.patterns;

import sk.tuke.kpi.oop.game.characters.Alien;
import sk.tuke.kpi.oop.game.characters.Alive;
import sk.tuke.kpi.oop.game.characters.Enemy;
import sk.tuke.kpi.oop.game.characters.FireBurning;
import sk.tuke.kpi.oop.game.characters.bosses.Boss;

import java.util.function.Predicate;

public class EnemyVisitor implements Visitor {


    @Override
    public void killAlive(Alien alien) {
        Alive actor = (Alive) alien.getScene().getActors().stream()
            .filter(Alive.class::isInstance)
           .filter(alien::intersects)
            .filter(Predicate.not(Enemy.class::isInstance))
            .filter(Predicate.not(Boss.class::isInstance))
            .findFirst()
            .orElse(null);

        if (actor != null) {
            actor.getHealth().drain(1);
        }
    }

    @Override
    public void killAlive(FireBurning fire) {
        Alive actor = (Alive) fire.getScene().getActors().stream()
            .filter(Alive.class::isInstance)
            .filter(fire::intersects)
            .filter(Predicate.not(FireBurning.class::isInstance))
            .findFirst()
            .orElse(null);

        if (actor != null) {
            actor.getHealth().drain(20);
        }

    }
}
