package sk.tuke.kpi.oop.game.scenarios;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.gamelib.framework.Scenario;
import sk.tuke.kpi.oop.game.Cooler;
import sk.tuke.kpi.oop.game.Reactor;

public class TrainingGameplay extends Scenario {


    @Override
    public void setupPlay(@NotNull Scene scene) {
        Reactor reactor = new Reactor();  // vytvorenie instancie reaktora
        scene.addActor(reactor, 64, 64);  // pridanie reaktora do sceny na poziciu [x=64, y=64]
        reactor.turnOn();


        Cooler cooler= new Cooler(reactor);
        scene.addActor(cooler, 30, 30);
        new ActionSequence<>(
            new Wait<>(5),
            new Invoke<>(cooler::turnOn)
        ).scheduleFor(cooler);



    }

}
