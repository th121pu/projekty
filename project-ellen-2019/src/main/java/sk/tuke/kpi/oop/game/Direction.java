package sk.tuke.kpi.oop.game;

public enum Direction {
    NORTH(0, 1),
    NORTHEAST(1, 1),
    NORTHWEST(-1, 1),
    SOUTH(0, -1),
    SOUTHEAST(1, -1),
    SOUTHWEST(-1, -1),
    EAST(1, 0),
    WEST(-1, 0),
    NONE(0, 0);

    private final int dx, dy;

    public int getDx() {
        return dx;
    }

    public int getDy() {
        return dy;
    }

    Direction(int dx, int dy) {
        this.dx = dx;
        this.dy = dy;
    }

    public static Direction convert(int dx, int dy) {

        if (dx == 0) {
            if (dy == 1) return NORTH;
            if (dy == -1) return SOUTH;
        }

        if (dx == -1) {
            if (dy == 1) return NORTHWEST;
            if (dy == 0) return WEST;
            return SOUTHWEST;
        }

        if (dy == -1) return SOUTHWEST;
        if (dy == 0) return EAST;
        return NORTHEAST;

    }

    public float getAngle() {
        if (dx == 0) {
            if (dy == 1) return 0;
            if (dy == -1) return 180;
        }

        if (dx == -1) {
            if (dy == 1) return 45;
            if (dy == 0) return 90;
             return 135;
        }

            if (dy == -1) return 225;
            if (dy == 0) return 270;
        return 315;
    }

    public static Direction fromAngle(float angle) {
        if (angle == 0) return NORTH;
        if (angle == 45) return NORTHWEST;
        if (angle == 180) return SOUTH;
        if (angle == 90) return WEST;
        if (angle == 135) return SOUTHWEST;
        if (angle == 225) return SOUTHEAST;
        if (angle == 270) return EAST;

        return NORTHEAST;
    }


    public Direction combine(Direction other) {
        Direction nova = Direction.NONE;

        /*
         if (other.dx == 0 && other.dy == 0) {
            return nova;
        }
         */

        int x, y;
        x = this.getDx() + other.getDx();
        if (x > 1) x = 1;
        if (x < -1) x = -1;

        y = this.getDy() + other.getDy();
        if (y > 1) y = 1;
        if (y < -1) y = -1;

        for (Direction u : Direction.values()) {
            if (u.getDx() == x && u.getDy() == y) {
                nova = u;
            }
        }

        //return Direction.values().stream()


        return nova;
    }


}
