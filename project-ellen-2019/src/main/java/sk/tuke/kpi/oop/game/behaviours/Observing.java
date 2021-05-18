package sk.tuke.kpi.oop.game.behaviours;

import sk.tuke.kpi.gamelib.Actor;
import sk.tuke.kpi.gamelib.messages.Topic;

import java.util.function.Predicate;

public class Observing<T, A extends Actor> implements Behaviour<A> {
   private Topic<T> topic;
    private Predicate<T> predicate;
    private Behaviour<A> delegate;


    public Observing(Topic<T> topic, Predicate<T> predicate, Behaviour<A> delegate) {
        this.topic = topic;
        this.predicate = predicate;
        this.delegate = delegate;
    }

    @Override
    public void setUp(A actor) {
        if (actor != null) {
            actor.getScene().getMessageBus().subscribe(topic, tester -> receive(tester, actor));
        }
    }

    public void receive(T tester, A actor) {
        if (tester == null || actor ==null) return;
        if (predicate.test(tester) ) {
                delegate.setUp(actor);
            }
        }




}

