package sk.tuke.kpi.oop.game.items;

import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.oop.game.characters.Alive;

public class Energy extends AbstractActor implements Usable<Alive> {

    public Energy() {
        setAnimation(new Animation("sprites/energy.png", 16, 16));
    }


    @Override
    public void useWith(Alive ripley) {
        if (ripley == null) return;
        if (ripley.getHealth().getValue() < 100) {
            ripley.getHealth().restore();
            getScene().removeActor(this);
        }
    }

    @Override
    public Class<Alive> getUsingActorClass() {
        return Alive.class;
    }


}
