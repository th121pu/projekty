package sk.tuke.kpi.oop.game.weapons;

public abstract class Firearm {
    private int startAmmo;
    private int maxAmmo;

    public Firearm(int startAmmo, int maxAmmo) {
        this.startAmmo = startAmmo;
        this.maxAmmo = maxAmmo;

    }

    public Firearm(int ammoValue) {
        this (ammoValue, ammoValue);
    }

    public int getAmmo() {
        return startAmmo;
    }
    public int getMax() {
        return maxAmmo;
    }



    public void reload(int newAmmo) {
        if (startAmmo + newAmmo <= maxAmmo) {
            startAmmo = startAmmo + newAmmo;
        }
        else {
            startAmmo = maxAmmo;
        }
    }

    public Fireable fire() {
        if (startAmmo > 0) {
            startAmmo--;
            return createBullet();
        }
        return null;
    }

    protected abstract Fireable createBullet();


}
