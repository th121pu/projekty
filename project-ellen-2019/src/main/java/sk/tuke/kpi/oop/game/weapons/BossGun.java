package sk.tuke.kpi.oop.game.weapons;

public class BossGun extends Firearm {

    public BossGun(int startAmmo, int maxAmmo) {
        super(startAmmo, maxAmmo);
    }

    @Override
    protected Fireable createBullet() {
        return new BossBullet();
    }
}

