package sk.tuke.kpi.oop.game;

import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.oop.game.characters.Ripley;
import sk.tuke.kpi.oop.game.items.Hammer;
import sk.tuke.kpi.oop.game.items.Usable;

public class Locker extends AbstractActor implements Usable<Ripley> {


    private boolean locked;
    public Locker() {
    setAnimation(new Animation("sprites/locker.png", 16, 16));
    locked = true;
    }

    @Override
    public void useWith(Ripley actor) {
        if (locked) {
            getScene().addActor(new Hammer(), getPosX(), getPosY());
            locked = false;
        }
    }

    @Override
    public Class<Ripley> getUsingActorClass() {
        return Ripley.class;
    }
}
