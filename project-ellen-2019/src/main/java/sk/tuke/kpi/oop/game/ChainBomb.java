package sk.tuke.kpi.oop.game;

import sk.tuke.kpi.gamelib.Actor;
import sk.tuke.kpi.gamelib.actions.ActionSequence;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.Wait;
import sk.tuke.kpi.gamelib.graphics.Animation;

import java.awt.geom.Ellipse2D;
import java.awt.geom.Rectangle2D;

public class ChainBomb extends TimeBomb {
    private Animation explosion;
    private float explodeTime;


    public ChainBomb(float explodeTime) {
        super(explodeTime);
        this.explodeTime= explodeTime;
        explosion = new Animation("sprites/small_explosion.png", 16, 16, 0.1f, Animation.PlayMode.ONCE);
    }

    @Override
    public void deto() {
        if (isActivated()) {
            new ActionSequence<>(
                new Wait<>(explodeTime-0.1f),
                new Invoke<>(this::explode2),
                new Wait<>(  (float)explosion.getFrameCount()* explosion.getFrameDuration()),
                new Invoke<>(this::del)
            ).scheduleFor(this);
        }
    }

    public void explode2() {
      setAnimation(explosion);
        Ellipse2D.Float elipse = new Ellipse2D.Float(getPosX()-50, getPosY()-50, 102, 102);

        for (Actor actor : getScene().getActors()) {
            if (actor instanceof ChainBomb) {
                ChainBomb chainBombTest = (ChainBomb) actor;
                Rectangle2D.Float rect = new Rectangle2D.Float(chainBombTest.getPosX(), chainBombTest.getPosY(), chainBombTest.getWidth(),chainBombTest.getHeight());
                if((elipse.intersects(rect) || (Math.abs(getPosX()-chainBombTest.getPosX()) < 50 && Math.abs(getPosY() - chainBombTest.getPosY()) < 50))  && !chainBombTest.isActivated()) {
                    chainBombTest.activate();
                }
                }
            }
        }
    }




