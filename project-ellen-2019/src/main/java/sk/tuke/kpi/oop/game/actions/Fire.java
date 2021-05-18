package sk.tuke.kpi.oop.game.actions;

import sk.tuke.kpi.gamelib.framework.actions.AbstractAction;
import sk.tuke.kpi.oop.game.Direction;
import sk.tuke.kpi.oop.game.characters.Armed;
import sk.tuke.kpi.oop.game.weapons.Fireable;

import java.util.Objects;

public class Fire<K extends Armed> extends AbstractAction<K> {


   public Fire() {

    }




    @Override
    public void execute(float deltaTime) {
        if (getActor() != null && !isDone() ) {
            Fireable bullet = getActor().getFirearm().fire();
            if (bullet == null) return;
            Objects.requireNonNull(getActor().getScene()).addActor(bullet, getActor().getPosX()+8 , getActor().getPosY()+ 8);
            bullet.getAnimation().setRotation(getActor().getAnimation().getRotation());
            new Move<>(Direction.fromAngle(getActor().getAnimation().getRotation()), 1199).scheduleFor(bullet);

        }
        setDone(true);


    }




}
