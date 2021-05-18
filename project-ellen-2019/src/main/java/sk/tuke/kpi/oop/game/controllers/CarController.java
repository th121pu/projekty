package sk.tuke.kpi.oop.game.controllers;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Input;
import sk.tuke.kpi.gamelib.KeyboardListener;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.messages.Topic;
import sk.tuke.kpi.oop.game.characters.FireCar;

public class CarController implements KeyboardListener {

    public static final Topic<CarController> CAR_START = Topic.create("car start", CarController.class);
    public static final Topic<CarController> CAR_STOP = Topic.create("car sttop", CarController.class);

    private Scene scena;
    private int i;

    public CarController(Scene scene) {
        i = 0;
        this.scena = scene;
    }



    @Override
    public void keyPressed(@NotNull Input.Key key) {
        if (scena.getFirstActorByType(FireCar.class) != null) {
            if (key == Input.Key.C && scena != null && i == 0) {
                scena.getMessageBus().publish(CAR_START, this);
                i++;
            }

            if (key == Input.Key.Q && scena != null && i == 1) {
                scena.getMessageBus().publish(CAR_STOP, this);
                i++;
            }
        }
    }

}
