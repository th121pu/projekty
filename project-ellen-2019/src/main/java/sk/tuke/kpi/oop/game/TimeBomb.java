package sk.tuke.kpi.oop.game;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.gamelib.graphics.Animation;

public class TimeBomb extends AbstractActor {
    private float explodeTime;
    private Animation  bombActive, explosion;
    private boolean activated;

    public TimeBomb(float explodeTime) {
        setAnimation(new Animation("sprites/bomb.png", 16, 16));
        bombActive=  new Animation("sprites/bomb_activated.png", 16, 16, 0.1f, Animation.PlayMode.LOOP_PINGPONG);
        explosion = new Animation("sprites/small_explosion.png", 16, 16, 0.1f, Animation.PlayMode.ONCE);
        this.explodeTime= explodeTime;
        activated= false;
    }

    public void activate() {
        setAnimation(bombActive);
        activated= true;
    }

    public boolean isActivated() {
        if (activated== true) return true;
        else return false;
    }

    public void explode() {
        setAnimation(explosion);
    }

    public void del() {
        getScene().removeActor(this);
    }



    public void deto() {
        if (isActivated()) {
            new ActionSequence<>(
                new Wait<>(explodeTime-0.1f),
                new Invoke<>(this::explode),
                new Wait<>(  (float)explosion.getFrameCount()* explosion.getFrameDuration()),
                new Invoke<>(this::del)
            ).scheduleFor(this);
        }
    }


    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
        new Loop<>(new Invoke<>(this::deto)).scheduleFor(this);
    }






}
