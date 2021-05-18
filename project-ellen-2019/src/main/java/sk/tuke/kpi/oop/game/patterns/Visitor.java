package sk.tuke.kpi.oop.game.patterns;

import sk.tuke.kpi.oop.game.characters.Alien;
import sk.tuke.kpi.oop.game.characters.FireBurning;

public interface Visitor {
    void killAlive(Alien alien);
    void killAlive(FireBurning fire);
}
