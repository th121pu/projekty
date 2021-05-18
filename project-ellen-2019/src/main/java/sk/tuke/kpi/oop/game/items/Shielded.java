package sk.tuke.kpi.oop.game.items;

import sk.tuke.kpi.gamelib.Actor;
import sk.tuke.kpi.oop.game.characters.Alive;

public interface Shielded extends Actor, Alive {
    void shieldOn();
    void shieldOff();
}
