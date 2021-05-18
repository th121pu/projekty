package sk.tuke.kpi.oop.game.items;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import sk.tuke.kpi.gamelib.ActorContainer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

public class Backpack implements ActorContainer<Collectible> {
        private int capacity;
        private String name;
        private List<Collectible> lifo;

    public Backpack(String name, int capacity) {
        this.capacity = capacity;
        this.name = name;
        lifo = new ArrayList<>();
    }

    @Override
    public @NotNull List<Collectible> getContent() {
        return List.copyOf(lifo);
    }

    @Override
    public int getCapacity() {
        return capacity;
    }

    @Override
    public int getSize() {
        return lifo.size();
    }

    @Override
    public @NotNull String getName() {
        return name;
    }

    @Override
    public void add(@NotNull Collectible actor) {
        if (lifo.size() < capacity) {
            lifo.add(actor);
        }
        else {
            throw new IllegalStateException(getName()+ "is full");
        }
    }

    @Override
    public void remove(@NotNull Collectible actor) {
        lifo.remove(actor);
    }

    @Nullable
    @Override
    public Collectible peek() {
        if (!lifo.isEmpty())  return lifo.get(lifo.size()-1);
        return null;
    }

    @Override
    public void shift() {
        Collections.rotate(lifo, 1);
    }

    @NotNull
    @Override
    public Iterator<Collectible> iterator() {
        return lifo.iterator();
    }
}
