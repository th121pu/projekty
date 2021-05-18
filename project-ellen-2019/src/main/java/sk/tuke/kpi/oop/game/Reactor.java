package sk.tuke.kpi.oop.game;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.oop.game.actions.PerpetualReactorHeating;

import java.util.ArrayList;
import java.util.List;

public class Reactor extends AbstractActor implements Repairable, Switchable {

    private int temperature;
    private int damage;
    private boolean working;
    private Animation turnedOnAnimation;
    private Animation hotAnimation;
    private Animation brokenAnimation;
    private Animation turnedOffAnimation;
    private Animation extinguishedAnimation;

    private List<EnergyConsumer> devices;

    public Reactor() {
        temperature = 0;
        damage = 0;
        working = false;
        turnedOnAnimation = new Animation("sprites/reactor_on.png", 80, 80, 0.1f, Animation.PlayMode.LOOP_PINGPONG);
        hotAnimation = new Animation("sprites/reactor_hot.png", 80, 80, 0.05f, Animation.PlayMode.LOOP_PINGPONG);
        brokenAnimation = new Animation("sprites/reactor_broken.png", 80, 80, 0.1f, Animation.PlayMode.LOOP_PINGPONG);
        turnedOffAnimation = new Animation("sprites/reactor.png", 80, 80, 0.1f, Animation.PlayMode.LOOP_PINGPONG);
        extinguishedAnimation = new Animation("sprites/reactor_extinguished.png", 80, 80, 0.1f, Animation.PlayMode.LOOP_PINGPONG);
        setAnimation(turnedOffAnimation);
        devices = new ArrayList<>();
    }

    public int getTemperature() {
        return temperature;
    }

    public int getDamage() {
        return damage;
    }

public void countT() {
        if(temperature>=6000) {
        damage = 100;
        turnOff();
    }

    updateAnimation();

}
    public void increaseTemperature(int increment) {

        if (increment >= 0 && damage <100  && working) {
            if (damage >= 33 && damage <= 66) {
                temperature =(int)(temperature +(1.5*increment));
                countT();
            }

            else if (damage > 66) {
                temperature = temperature + (2 * increment);
                countT();
            }

            else {
                temperature = temperature + increment;
                countT();
            }

            if (temperature > 2000 && temperature<6000) {
                int cur_temperature = temperature - 2000;
                damage = (int) Math.round(cur_temperature / 40);
            }



         complete();

            updateAnimation();
        }
    }


    public void complete() {
        if (damage >= 100) {
            damage = 100;
            turnOff();
        }
    }

    public void decreaseTemperature (int decrement) {
        if (decrement >= 0 && damage <100 && working)   {
            if (damage >= 50) {
                temperature = temperature - (int) Math.round(decrement / 2);
                updateAnimation();
            }
            else if (damage == 100) {
                updateAnimation();
            }
            else if (damage < 50) {
                temperature = temperature - decrement;
                updateAnimation();
            }
        }
    }

    public void turnOn(){
        if (damage <100) {
            working = true;
            setAnimation(turnedOnAnimation);
        }
        this.devices.forEach(this::energyOn);

    }

    public void energyOn(EnergyConsumer ener) {
        ener.setPowered(true);
    }

    public void energyOff(EnergyConsumer ener) {
        ener.setPowered(false);
    }

    public void turnOff(){
        working = false;
        if (damage < 100) {
            setAnimation(turnedOffAnimation);
        }
        else {
            setAnimation(brokenAnimation);
        }
        this.devices.forEach(this::energyOff);
    }
    public boolean isOn(){
        if(working) return true;
        else return false;
    }



    public void updateAnimation () {
        if (temperature <=4000) {
            setAnimation(turnedOnAnimation);
        }

        if (temperature >4000) {
            setAnimation(hotAnimation);
        }

        if (temperature >=6000) {
            turnOff();
            setAnimation(brokenAnimation);
        }

    }


    public boolean repair() {
            if (damage > 0 && damage < 100) {
                temperature = ((damage - 50) * 40) + 2000;
                if (damage > 50) {
                    damage = damage - 50;
                    updateAnimation();
                }
                else {
                    damage = 0;
                    this.devices.forEach(this::energyOn);
                    updateAnimation();
                }
                return true;

            }
        return false;
        }


    public boolean extinguish() {
        if (temperature >4000) {
            temperature = 4000;
            turnOff();
            setAnimation(extinguishedAnimation);
            return true;
        }
        return false;
    }


    public void addDevice(EnergyConsumer device) {
         devices.add (device);

        if (damage == 0 && isOn() ) {
            device.setPowered(true);
        }

    }

    public void removeDevice (EnergyConsumer device){
        device.setPowered(false);
        devices.remove(device);
        //getScene().removeActor(device);
    }
///*
    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
      //  new PerpetualReactorHeating(1).scheduleFor(this);
        scene.scheduleAction(new PerpetualReactorHeating(1), this);
    }
//*/
}





