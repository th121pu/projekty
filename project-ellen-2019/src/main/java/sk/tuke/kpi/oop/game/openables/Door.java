package sk.tuke.kpi.oop.game.openables;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Actor;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.framework.AbstractActor;
import sk.tuke.kpi.gamelib.graphics.Animation;
import sk.tuke.kpi.gamelib.map.MapTile;
import sk.tuke.kpi.gamelib.messages.Topic;
import sk.tuke.kpi.oop.game.items.Usable;

public class Door extends AbstractActor implements Openable, Usable<Actor> {


    private boolean isOpen;
    public static final Topic<Door> DOOR_OPENED = Topic.create("door opened", Door.class);
    public static final Topic<Door> DOOR_CLOSED = Topic.create("door closed", Door.class);
    private Orientation side;
    public enum Orientation {
        HORIZONTAL,
        VERTICAL
    }


    public Door(String name, Orientation side) {
        super (name);


        isOpen = false;
        this.side = side;
        switch (side) {
            case HORIZONTAL:
                setAnimation(new Animation("sprites/hdoor.png", 32, 16, 0.1f, Animation.PlayMode.ONCE));
                break;
            case VERTICAL:
                setAnimation(new Animation("sprites/vdoor.png", 16, 32, 0.1f, Animation.PlayMode.ONCE));
                break;
            default: break;
        }
        this.getAnimation().stop();
    }

    @Override
    public void addedToScene(@NotNull Scene scene) {
        super.addedToScene(scene);
       switcher();

    }


    public void switcher() {
        switch (side) {
            case HORIZONTAL:
                getScene().getMap().getTile(this.getPosX() /16, this.getPosY() / 16).setType(MapTile.Type.WALL);
                getScene().getMap().getTile(this.getPosX() /16+1, this.getPosY() / 16  ).setType(MapTile.Type.WALL);
                break;
            case VERTICAL:
                getScene().getMap().getTile(this.getPosX() /16, this.getPosY() / 16).setType(MapTile.Type.WALL);
                getScene().getMap().getTile(this.getPosX() /16 , this.getPosY() / 16 +1 ).setType(MapTile.Type.WALL);
                break;
            default: break;
        }
    }
    @Override
    public void open() {
        isOpen = true;
        switch (side) {
            case HORIZONTAL:
                getScene().getMap().getTile(this.getPosX() /16, this.getPosY() / 16).setType(MapTile.Type.CLEAR);
                getScene().getMap().getTile(this.getPosX() /16 + 1, this.getPosY() / 16  ).setType(MapTile.Type.CLEAR);
                break;
            case VERTICAL:
                getScene().getMap().getTile(this.getPosX() /16, this.getPosY() / 16).setType(MapTile.Type.CLEAR);
                getScene().getMap().getTile(this.getPosX() /16 , this.getPosY() / 16 + 1 ).setType(MapTile.Type.CLEAR);
                break;
            default: break;
        }
        getAnimation().setPlayMode(Animation.PlayMode.ONCE_REVERSED);
        getAnimation().play();
        getAnimation().stop();
        getScene().getMessageBus().publish(DOOR_OPENED, this);

    }

    @Override
    public void close() {
        isOpen = false;
        switcher();
        getAnimation().setPlayMode(Animation.PlayMode.ONCE);
        getAnimation().play();
        getAnimation().stop();
        getScene().getMessageBus().publish(DOOR_CLOSED, this);
    }

    @Override
    public boolean isOpen() {
        if (isOpen) return true;
        return false;
    }

    @Override
    public void useWith(Actor actor) {
        if (isOpen) close();
        else open();
    }

    @Override
    public Class<Actor> getUsingActorClass() {
        return Actor.class;
    }


}
