package sk.tuke.kpi.oop.game.characters;


import java.util.ArrayList;
import java.util.List;

public class Health {

    private int maxHealth;
    private List<ExhaustionEffect> efekty;
    private int startHealth;
    private int i;

    public Health(int startHealth, int maxHealth) {
        this.startHealth = startHealth;
        this.maxHealth = maxHealth;
        efekty = new ArrayList<>();
        i= 0;
    }

    public Health(int healthValue) {
        this (healthValue, healthValue);
    }

    public int getValue() {
        return this.startHealth;
    }



    public void refill(int amount) {
        if (startHealth + amount <= maxHealth) {
            startHealth = startHealth + amount;
        }
        else {
            startHealth = maxHealth;
        }
    }

    public void restore(){
        startHealth = maxHealth;
    }

    public void drain(int amount) {
        if (startHealth - amount >0) {
            startHealth = startHealth - amount;
        }
        else {
            exhaust();
        }
    }

    public void exhaust() {
        startHealth = 0;
        if (i==0) {
            for (int j =0; j< efekty.size(); j++) {
                efekty.get(j).apply();
            }
            i= 1;
        }

    }

    public void onExhaustion(ExhaustionEffect effect) {
        efekty.add(effect);
    }



    @FunctionalInterface
    public interface ExhaustionEffect {
        void apply();
    }
}
