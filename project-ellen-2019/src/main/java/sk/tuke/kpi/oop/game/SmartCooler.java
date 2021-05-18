
package sk.tuke.kpi.oop.game;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.gamelib.Scene;

public class SmartCooler extends Cooler {

    public SmartCooler(Reactor reactor) {
        super(reactor);
    }



    private void cool() {
        if (getReactor() == null) return;
        if (getReactor().getTemperature() >= 2500) {
            turnOn();
        }

        if (getReactor().getTemperature() <= 1499) {
            turnOff();
        }
    }

        @Override
        public void addedToScene(@NotNull Scene scene) {
            super.addedToScene(scene);
            new Loop<>(new Invoke<>(this::cool)).scheduleFor(this);
        }
    }









