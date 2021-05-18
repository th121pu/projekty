package sk.tuke.kpi.oop.game.scenarios;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Input;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.SceneListener;
import sk.tuke.kpi.gamelib.actions.When;
import sk.tuke.kpi.oop.game.actions.Use;
import sk.tuke.kpi.oop.game.characters.Ripley;
import sk.tuke.kpi.oop.game.controllers.KeeperController;
import sk.tuke.kpi.oop.game.items.*;

public class FirstSteps implements SceneListener {
    private Ripley ripley;
    private Energy energy;
    private Ammo ammo;
    @Override
    public void sceneInitialized(@NotNull Scene scene) {
        ripley = new Ripley();
        scene.addActor(ripley, 0, 0);

       // MovableController movableController = new MovableController(ripley);
        Input input = scene.getInput();
        //input.registerListener(movableController);

        KeeperController keeperController = new KeeperController(ripley);
        input.registerListener(keeperController);

        energy = new Energy();
        ammo = new Ammo();
        scene.addActor(energy,50, 50);
        scene.addActor(ammo, 100,100);
        new When<>(
            () -> ripley.intersects(energy),
            new Use<>(energy)
        ).scheduleFor(ripley);

        new When<>(
            () -> ripley.intersects(ammo),
            new Use<>(ammo)
        ).scheduleFor(ripley);

        FireExtinguisher fire = new FireExtinguisher();
        //ripley.getBackpack().add(fire);
        scene.addActor(fire, 80, 200);
        Hammer hammer = new Hammer();
        ripley.getBackpack().add(hammer);
        Wrench wrench = new Wrench();
        ripley.getBackpack().add(wrench);

        scene.getGame().pushActorContainer(ripley.getBackpack());
        ripley.getBackpack().shift();
    }

    @Override
    public void sceneUpdating(Scene scene) {
        ripley.showRipleyState();
    }
}

