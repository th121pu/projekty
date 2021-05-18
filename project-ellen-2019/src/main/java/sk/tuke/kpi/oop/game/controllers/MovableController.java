package sk.tuke.kpi.oop.game.controllers;

import org.jetbrains.annotations.NotNull;
import sk.tuke.kpi.gamelib.Actor;
import sk.tuke.kpi.gamelib.Input;
import sk.tuke.kpi.gamelib.KeyboardListener;
import sk.tuke.kpi.oop.game.Direction;
import sk.tuke.kpi.oop.game.Movable;
import sk.tuke.kpi.oop.game.actions.Move;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class MovableController implements KeyboardListener {

    private Map<Input.Key, Direction> keyDirectionMap = Map.ofEntries(
        Map.entry(Input.Key.UP, Direction.NORTH),
        Map.entry(Input.Key.DOWN, Direction.SOUTH),
        Map.entry(Input.Key.LEFT, Direction.WEST),
        Map.entry(Input.Key.RIGHT, Direction.EAST)
    );
    private Move<Movable> move;
    private Actor actor;
    private Set<Direction> smery;

    public MovableController(Movable actor) {
        this.actor = actor;
        smery = new HashSet<Direction>();

    }

    @Override
    public void keyPressed(@NotNull Input.Key key) {
        if (keyDirectionMap.containsKey(key)) {
          //  System.out.println("pridane ");
            smery.add(keyDirectionMap.get(key));
          //  try {
                if (smery.isEmpty() || move != null) {
                    move.stop();
               }
          //  }
          //  catch(NullPointerException e) {
               // System.out.print("NullPointerException Caught");
           // }

            Direction combinedDirection = Direction.NONE;

            for (Direction spolu: smery) {
                 combinedDirection = combinedDirection.combine(spolu);
            }

            move = new Move<>(combinedDirection, 999);
           // try {
                move.scheduleFor((Movable) actor);
           // }
           // catch(NullPointerException e) {
             //   System.out.print("NullPointerException Caught");
           // }
        }

    }



    @Override
    public void keyReleased(@NotNull Input.Key key) {
        if(keyDirectionMap.containsKey(key)){
           // System.out.println("odobrane ");
                smery.remove(keyDirectionMap.get(key));
            //try {
                if (smery.isEmpty() || move != null) {
                    move.stop();
                }
           // }
           // catch(NullPointerException e) {
               // System.out.print("NullPointerException Caught");
            //}
            Direction combinedDirection = Direction.NONE;

            for (Direction spolu: smery) {
                combinedDirection = combinedDirection.combine(spolu);
            }

            if (combinedDirection != Direction.NONE) {
                move = new Move<>(combinedDirection, 999);
                //try {
                    move.scheduleFor((Movable) actor);
              //  }
                //catch(NullPointerException e) {
                  //  System.out.print("NullPointerException Caught");
               // }
            }
        }
    }

}
