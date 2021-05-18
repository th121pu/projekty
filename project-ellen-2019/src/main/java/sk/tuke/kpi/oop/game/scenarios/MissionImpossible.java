package sk.tuke.kpi.oop.game.scenarios;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import sk.tuke.kpi.gamelib.*;
import sk.tuke.kpi.oop.game.Locker;
import sk.tuke.kpi.oop.game.Ventilator;
import sk.tuke.kpi.oop.game.characters.Ripley;
import sk.tuke.kpi.oop.game.controllers.KeeperController;
import sk.tuke.kpi.oop.game.items.AccessCard;
import sk.tuke.kpi.oop.game.items.Energy;
import sk.tuke.kpi.oop.game.items.Hammer;
import sk.tuke.kpi.oop.game.openables.Door;

public class MissionImpossible implements SceneListener {

    private Ripley ripley;
    @Override
    public void sceneInitialized(@NotNull Scene scene) {

        ripley = scene.getFirstActorByType(Ripley.class);
        scene.follow(ripley);

        //MovableController movableController = new MovableController(ripley);
        Input input = scene.getInput();
        //Disposable moving = input.registerListener(movableController);

        KeeperController keeperController = new KeeperController(ripley);
        Disposable taking = input.registerListener(keeperController);

        Hammer hammer = new Hammer();
        ripley.getBackpack().add(hammer);
        scene.getGame().pushActorContainer(ripley.getBackpack());

        scene.getMessageBus().subscribe(Door.DOOR_OPENED, (Ripley) -> ripley.lowerEnergy());
        scene.getMessageBus().subscribe(Ventilator.VENTILATOR_REPAIRED, (Ripley) -> ripley.getEnergyRepaired().dispose());
        //scene.getMessageBus().subscribe(Ripley.RIPLEY_DIED, (Ripley) -> moving.dispose());
        scene.getMessageBus().subscribe(Ripley.RIPLEY_DIED, (Ripley) -> taking.dispose());


    }



    @Override
    public void sceneUpdating(Scene scene) {
        ripley.showRipleyState();
    }

    public static class Factory implements ActorFactory {

        @Override
        public @Nullable Actor create(@Nullable String type, @Nullable String name) {
            if (name.equals("access card")) return new AccessCard();
            //if (name.equals("door")) return new LockedDoor();
            if (name.equals("energy")) return new Energy();
            if (name.equals("ellen")) return new Ripley();
            if (name.equals("locker")) return new Locker();
            if (name.equals("ventilator")) return new Ventilator();
            return null;
        }
    }
}
