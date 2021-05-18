package sk.tuke.kpi.oop.game.patterns;

import sk.tuke.kpi.oop.game.characters.bosses.Boss;

public interface State  {
    void kill(Boss boss);
}
