package sk.tuke.kpi.oop.game.actions;

import sk.tuke.kpi.gamelib.framework.actions.AbstractAction;
import sk.tuke.kpi.oop.game.Reactor;

public class PerpetualReactorHeating extends AbstractAction<Reactor> {
    private int temperatureInc;

    public PerpetualReactorHeating(int temperatureInc) {
        this.temperatureInc = temperatureInc;
    }

    @Override
    public void execute(float deltaTime) {
        Reactor reactor = (Reactor) getActor();
        if (reactor == null) return;
        reactor.increaseTemperature(temperatureInc);
}





}
