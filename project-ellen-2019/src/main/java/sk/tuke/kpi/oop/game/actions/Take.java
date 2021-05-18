package sk.tuke.kpi.oop.game.actions;

import sk.tuke.kpi.gamelib.Actor;
import sk.tuke.kpi.gamelib.framework.actions.AbstractAction;
import sk.tuke.kpi.oop.game.Keeper;
import sk.tuke.kpi.oop.game.items.Collectible;

import java.util.List;

public class Take<K extends Keeper> extends AbstractAction<K> {



    public Take() {

    }

    @Override
    public void execute(float deltaTime) {
        if (!isDone() && getActor() != null ) {

            List<Actor> actors =  getActor().getScene().getActors();

            for (int i =0; i< actors.size(); i++) {
                if (actors.get(i).intersects(getActor()) && actors.get(i) instanceof Collectible) {
                    try {
                        getActor().getBackpack().add((Collectible) actors.get(i));
                        getActor().getScene().removeActor(actors.get(i));
                        break;
                    }
                    catch (Exception exception) {
                        getActor().getScene().getOverlay().drawText(exception.getMessage(), 20, 50).showFor(2);
                    }
                }
            }
        }
        setDone(true);
    }
}
