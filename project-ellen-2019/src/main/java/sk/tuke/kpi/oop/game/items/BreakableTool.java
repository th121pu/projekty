package sk.tuke.kpi.oop.game.items;

import sk.tuke.kpi.gamelib.Actor;
import sk.tuke.kpi.gamelib.framework.AbstractActor;

public abstract class BreakableTool<A extends Actor> extends AbstractActor implements Usable<A>{


    private int remainingUses;
   // private Ripley ripley;

    public BreakableTool(int remainingUses) {
        this.remainingUses= remainingUses;
    }

    public int getRemainingUses() {
        return this.remainingUses;
    }

    public void setRemainingUses(int remainingUses) {
        this.remainingUses = remainingUses;
    }

    @Override
    public void useWith(A actor) {
        this.remainingUses--;
        //ripley = getScene().getFirstActorByType(Ripley.class);

        if (this.remainingUses == 0) {

           // ripley.getBackpack().remove(ripley.getBackpack().peek());
          //  getScene().removeActor(this);
        }


    }
}

