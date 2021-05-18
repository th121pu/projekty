package sk.tuke.kpi.oop.game.characters.bosses;

import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.oop.game.actions.Fire;
import sk.tuke.kpi.oop.game.patterns.State;

public class HalfHealth extends AbstractActor implements State{
    private Boss boss;

    public HalfHealth(Boss boss) {
        this.boss = boss;
    }

    @Override
    public void kill(Boss boss) {
        boss.setCurrentState(this);

        new Fire<>().scheduleFor(boss);

    }


}

