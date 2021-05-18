package sk.tuke.kpi.oop.game;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.actions.Invoke;
import sk.tuke.kpi.gamelib.actions.When;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.framework.actions.Loop;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.oop.game.characters.Ripley;

import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;

public class Teleport extends AbstractActor {
    private Teleport dest;
    private boolean teleported= false;


    public Teleport(Teleport dest) {
        setAnimation(new Animation("sprites/lift.png"));
        this.dest = dest;
    }

    public Teleport getDestination() {
        return dest;
    }

    public void setDestination(Teleport dest) {
        if (dest != this)
            this.dest = dest;
    }



    private boolean playerCentre(Ripley player) {
        Point2D.Float playerPosition = new Point2D.Float(player.getPosX() + player.getWidth() / 2,
            player.getPosY() + player.getHeight() / 2);
        Rectangle2D.Float teleportPosition = new Rectangle2D.Float(getPosX(), getPosY(), getWidth(), getHeight());
        if (teleportPosition.contains(playerPosition)) return true;
        else return false;
    }


    public void teleportPlayer(Ripley player) {
        if (player != null) {
            player.setPosition(getPosX()+8, getPosY()+8);
            teleported = true;
        }

    }

    public void remove() {
        teleported = false;
    }

    public void startTele() {
        if (this.dest!= null) {
            Ripley player = getScene().getLastActorByType(Ripley.class);
            dest.teleportPlayer(player);
        }
    }

    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
        Ripley player = getScene().getLastActorByType(Ripley.class);

        new Loop<>(new When<>(() -> (!teleported && playerCentre(player)),
            new Invoke<>(this::startTele))).scheduleFor(player);

        new Loop<>(new When<>(() -> (teleported && !playerCentre(player)),
            new Invoke<>(this::remove))).scheduleFor(player);
    }
}


