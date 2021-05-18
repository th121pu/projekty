package sk.tuke.kpi.oop.game;

import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.graphics.Animation;

public class Computer extends AbstractActor implements EnergyConsumer {


    public boolean isEnergy() {
        return isEnergy;
    }

    private boolean isEnergy;

    public Computer () {
        setAnimation(new Animation("sprites/computer.png", 80,48  , 0.2f, Animation.PlayMode.LOOP_PINGPONG));
        isEnergy= true;
    }


    public int add (int a, int b)  {
        if (isEnergy) {
            return a + b;
        }
        else return 0;
    }

    public float add (float a, float b) {
        if (isEnergy) {
            return a + b;
        }
        else return 0;
    }

    public int sub (int a, int b) {
        if (isEnergy) {
            return a - b;
        }
        else return 0;
    }

    public float sub (float a, float b) {
        if (isEnergy) {
            return a - b;
        }
        else return 0;
    }



    @Override
    public void setPowered(boolean energy) {
            isEnergy = energy;
    }
}
