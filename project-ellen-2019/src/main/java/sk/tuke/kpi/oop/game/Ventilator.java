package sk.tuke.kpi.oop.game;

import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.gamelib.messages.Topic;

public class Ventilator extends AbstractActor implements Repairable {

    private boolean repaired;
    public static final Topic<Ventilator> VENTILATOR_REPAIRED = Topic.create("ventilator repaired", Ventilator.class);

    public Ventilator() {
        setAnimation(new Animation("sprites/ventilator.png", 32, 32,  0.1f, Animation.PlayMode.LOOP_PINGPONG));
        getAnimation().stop();
        repaired = false;

    }


    @Override
    public boolean repair() {
        if (!repaired) {
            this.getAnimation().play();
            repaired = true;
            getScene().getMessageBus().publish(VENTILATOR_REPAIRED, this);
            return true;
        }
        return false;
    }
}
