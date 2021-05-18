package sk.tuke.kpi.oop.game.scenarios;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import sk.tuke.kpi.gamelib.*;
import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.oop.game.Locker;
import sk.tuke.kpi.oop.game.Ventilator;
import sk.tuke.kpi.oop.game.behaviours.Hunting;
import sk.tuke.kpi.oop.game.behaviours.Observing;
import sk.tuke.kpi.oop.game.behaviours.RandomlyMoving;
import sk.tuke.kpi.oop.game.characters.*;
import sk.tuke.kpi.oop.game.characters.bosses.Boss;
import sk.tuke.kpi.oop.game.controllers.CarController;
import sk.tuke.kpi.oop.game.controllers.KeeperController;
import sk.tuke.kpi.oop.game.controllers.MovableController;
import sk.tuke.kpi.oop.game.controllers.ShooterController;
import sk.tuke.kpi.oop.game.items.AccessCard;
import sk.tuke.kpi.oop.game.items.Ammo;
import sk.tuke.kpi.oop.game.items.Energy;
import sk.tuke.kpi.oop.game.items.Shield;
import sk.tuke.kpi.oop.game.openables.Door;
import sk.tuke.kpi.oop.game.openables.LockedDoor;

public class Level implements SceneListener {
    private Ripley ripley;
    private FireCar fireCar;
    private MovableController movableController, carMovableController;
    private Disposable moving, carMoving;
    private KeeperController keeperController;
    private Disposable taking;
    private ShooterController shooterController, carShooterController;
    private Disposable shooting, carShooting;
    private Scene scena;
    private Boss boss;

    @Override
    public void sceneInitialized(@NotNull Scene scene) {
        Input input = scene.getInput();
        fireCar = scene.getFirstActorByType(FireCar.class);
        carMovableController = new MovableController(fireCar);
        carMoving = input.registerListener(carMovableController);
        carShooterController = new ShooterController(fireCar);
        carShooting = input.registerListener(carShooterController);
        scena= scene;

        scene.getMessageBus().subscribe(CarController.CAR_START, carController -> carMove(scena));
        scene.getMessageBus().subscribe(CarController.CAR_STOP, carController -> ripleyMove(scena));
        scene.getMessageBus().subscribe(FireCar.CAR_STOP, fireCar -> ripleyMove(scena));



        ripleyMove(scene);
        scene.getMessageBus().subscribe(Ventilator.VENTILATOR_REPAIRED, (Ripley) -> ripley.getEnergyRepaired().dispose());
        scene.getMessageBus().subscribe(Ripley.RIPLEY_DIED, (Ripley) -> moving.dispose());
        scene.getMessageBus().subscribe(Ripley.RIPLEY_DIED, (Ripley) -> taking.dispose());
        scene.getMessageBus().subscribe(Ripley.RIPLEY_DIED, (Ripley) -> shooting.dispose());
    }

    public void ripleyMove(Scene scene) {
        ripley = scene.getFirstActorByType(Ripley.class);
        scene.follow(ripley);
        Input input = scene.getInput();
        input.registerListener(new CarController(scene));

        fireCar.getAnimation().stop();

        carMoving.dispose();
        carShooting.dispose();

        movableController = new MovableController(ripley);
        new ActionSequence<>(
            new Wait<>(0.1f),
            new Invoke<>(this::movingRegister)
        ).scheduleFor(ripley);


        keeperController = new KeeperController(ripley);
        taking = input.registerListener(keeperController);

        shooterController = new ShooterController(ripley);
        shooting = input.registerListener(shooterController);

    }

    public void movingRegister() {
        moving = scena.getInput().registerListener(movableController);
    }

    public void carMovingRegister() {
        carMoving = scena.getInput().registerListener(carMovableController);;
    }

    public void carMove(Scene scene) {

        Input input = scene.getInput();
        FireCar fireCar = scene.getFirstActorByType(FireCar.class);
        scene.follow(fireCar);

        shooting.dispose();
        moving.dispose();
        taking.dispose();

        carMovableController = new MovableController(fireCar);
        new ActionSequence<>(
            new Wait<>(0.1f),
            new Invoke<>(this::carMovingRegister)
        ).scheduleFor(ripley);

        carShooterController = new ShooterController(fireCar);
        carShooting = input.registerListener(carShooterController);

    }

    @Override
    public void sceneUpdating(Scene scene) {
        ripley.showRipleyState();
    }



    public static class Factory implements ActorFactory {
        @Override
        public @Nullable Actor create(@Nullable String type, @Nullable String name) {
            if (name.equals("hunter") && type.equals("wait")) return new Hunter(new Observing<>(Door.DOOR_OPENED, (Door) -> Door.getName().equals("hunt door") , new Hunting()));
            if (name.equals("hunter")) return new Hunter((new Hunting()));
            if (name.equals("fire")) return new FireBurning();
            if (name.equals("firecar")) return new FireCar();
            if (name.equals("hugo door")) return new Door("hugo door" , Door.Orientation.HORIZONTAL);
            if (name.equals("hugoboss")) return new Boss(150, (new Observing<>(Door.DOOR_OPENED, (Door) -> Door.getName().equals("hugo door") , new Hunting())));
            if (name.equals("boss")) return new Boss(600, (new Observing<>(Door.DOOR_OPENED, (Door) -> Door.getName().equals("hunt door") , new Hunting())));
            if (name.equals("alien") && type.equals("running"))  return new Alien(100, new RandomlyMoving());
            if (name.equals("alien") && type.equals("waiting1"))  return new Alien(
                100, new Observing<>(Door.DOOR_OPENED, (Door) -> Door.getName().equals("front door") , new RandomlyMoving()));
            if (name.equals("access card")) return new AccessCard();
             if (name.equals("locked")) return new LockedDoor("locked", Door.Orientation.HORIZONTAL);
            if (name.equals("front door")) return new Door("front door" , Door.Orientation.VERTICAL);
            if (name.equals("exit door")) return new Door("exit door" , Door.Orientation.VERTICAL);
            if (name.equals("door")) return new Door("door" , Door.Orientation.VERTICAL);
            if (name.equals("hunt door")) return new Door("hunt door" , Door.Orientation.VERTICAL);
            if (name.equals("energy")) return new Energy();
            if (name.equals("ammo")) return new Ammo();
            if (name.equals("shield")) return new Shield();
            if (name.equals("ellen")) return new Ripley();

            if (name.equals("locker")) return new Locker();
            if (name.equals("ventilator")) return new Ventilator();
            // if (name.equals("alien mother") && type.equals("waiting2")) {
            //    return new AlienMother( new Observing<>(Door.DOOR_OPENED, (Door) -> Door.getName().equals("back door"), new RandomlyMoving()));
            //}
            return null;
        }
    }
}




