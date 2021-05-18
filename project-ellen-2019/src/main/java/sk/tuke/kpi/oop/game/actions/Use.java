package sk.tuke.kpi.oop.game.actions;

import sk.tuke.kpi.gamelib.Actor;
import sk.tuke.kpi.gamelib.Disposable;
import sk.tuke.kpi.gamelib.Scene;
import sk.tuke.kpi.gamelib.framework.actions.AbstractAction;
import sk.tuke.kpi.oop.game.items.Usable;

public class Use<E extends Actor> extends AbstractAction<E> {


    private Usable<E> tool;

    public Use (Usable<E> tool) {
        this.tool = tool;
    }

    @Override
    public void execute(float deltaTime) {
        if (!isDone()) {
            tool.useWith(getActor());
            setDone(true);
        }
    }

    public Disposable scheduleForIntersectingWith(Actor mediatingActor) {
        Scene scene = mediatingActor.getScene();
        if (scene == null) return null;
        Class<E> usingActorClass = tool.getUsingActorClass();
        return scene.getActors().stream()
            .filter(mediatingActor::intersects)
            .filter(usingActorClass::isInstance)
            .map(usingActorClass::cast)
            .findFirst()
            .map(this::scheduleFor)
            .orElse(null);

    }

}
