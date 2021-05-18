package sk.tuke.kpi.oop.game;

import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.graphics.Animation;

public class PowerSwitch extends AbstractActor {
    private Switchable device;

    public PowerSwitch(Switchable device) {
        setAnimation(new Animation("sprites/switch.png", 16, 16));
        this.device = device;
    }


    public void switchOff() {
        if (device ==null) return;
    device.turnOff();
    }


    public void switchOn() {
        if (device ==null) return;
        device.turnOn();
    }


    public Switchable getDevice() {
        return device;
    }
}
