package sk.tuke.kpi.oop.game;

import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.graphics.Animation;

public class Light extends AbstractActor implements Switchable, EnergyConsumer {
    private Animation turnedOnAnimation, turnedOffAnimation;
    private boolean isEnergy, working;



    public Light() {
        turnedOnAnimation = new Animation("sprites/light_on.png", 16, 16);
        turnedOffAnimation = new Animation("sprites/light_off.png", 16, 16);
        setAnimation(turnedOffAnimation);
        isEnergy = false;
        working = false;
    }

    public void turnOn(){
        working = true;
        updateAnimation();
    }

    public void turnOff(){
        working = false;
        updateAnimation();
    }

    public boolean isOn(){
        if(working) return true;
        else return false;
    }

    public void toggle() {
        if (working == true) {
            working = false;
        }

        else {
            working = true;
        }
        updateAnimation();
    }


    private void updateAnimation() {
        if (isEnergy && working) {
            setAnimation(turnedOnAnimation);
        }
        else {
            setAnimation(turnedOffAnimation);
        }
    }

    @Override
    public void setPowered(boolean energy) {
        isEnergy = energy;
        updateAnimation();
    }
}

