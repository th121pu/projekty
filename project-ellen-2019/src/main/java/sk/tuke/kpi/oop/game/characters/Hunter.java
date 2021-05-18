package sk.tuke.kpi.oop.game.characters;

import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.oop.game.behaviours.Behaviour;

public class Hunter extends Alien {

    public Hunter(Behaviour<? super Alien> behaviour) {
        super(50, behaviour);
        setAnimation(new Animation("sprites/lurker_alien.png", 32, 32, 0.1f, Animation.PlayMode.LOOP_PINGPONG));
    }


}
