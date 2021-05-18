package sk.tuke.kpi.oop.game;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.gamelib.graphics.Animation;

public class Cooler extends AbstractActor implements Switchable {
    private Animation turnedOffAnimation;
    private Animation turnedOnAnimation;
    private Reactor reactor;
    private boolean working;

    public Cooler(Reactor reactor) {
        turnedOnAnimation = new Animation("sprites/fan.png", 32, 32, 0.2f, Animation.PlayMode.LOOP_PINGPONG);
        turnedOffAnimation = new Animation("sprites/fan.png", 32, 32, 0f, Animation.PlayMode.LOOP_PINGPONG);
        setAnimation(turnedOnAnimation);
        this.reactor = reactor;
        working = true;
    }

    public Reactor getReactor() {
        return reactor;
    }

    public void turnOn() {
        working = true;
        setAnimation(turnedOnAnimation);
    }

    public void turnOff() {
        working = false;
        setAnimation(turnedOffAnimation);
    }

    public boolean isOn(){
        if(working) return true;
        else return false;
    }


    private void coolReactor() {
        if (reactor == null)  return;
            if (reactor.getTemperature() >= -1 && isOn())  {
            reactor.decreaseTemperature(1);
        }
    }

    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
        new Loop<>(new Invoke<>(this::coolReactor)).scheduleFor(this);
    }


}


