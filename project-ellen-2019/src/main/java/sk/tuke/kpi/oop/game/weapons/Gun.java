package sk.tuke.kpi.oop.game.weapons;

public class Gun extends Firearm {

    public Gun(int startAmmo, int maxAmmo) {
        super(startAmmo, maxAmmo);
    }

    @Override
    protected Fireable createBullet() {
        return new Bullet();
    }
}
