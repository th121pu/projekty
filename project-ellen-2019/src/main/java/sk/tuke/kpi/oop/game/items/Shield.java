package sk.tuke.kpi.oop.game.items;

import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.oop.game.characters.Alive;

public class Shield extends AbstractActor implements Usable<Shielded>{


    public Shield() {
        setAnimation(new Animation("sprites/shield2.png", 16, 16));
    }

    @Override
    public void useWith(Shielded ripley) {
        if (ripley == null) return;
            getScene().removeActor(this);

        new ActionSequence<>(
            new Invoke<>(ripley::shieldOn),
            new Wait<>(12),
            new Invoke<Alive>(ripley::shieldOff)
        ).scheduleFor(ripley);
    }


    @Override
    public Class<Shielded> getUsingActorClass() {
        return Shielded.class;
    }

}
