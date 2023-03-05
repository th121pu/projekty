package sk.tuke.unicanteen.model;

import javax.persistence.Column;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Objects;

public class CanteenMenuEntityPK implements Serializable {
    private int canteenId;
    private int menuId;

    @Column(name = "canteen_id")
    @Id
    public int getCanteenId() {
        return canteenId;
    }

    public void setCanteenId(int canteenId) {
        this.canteenId = canteenId;
    }

    @Column(name = "menu_id")
    @Id
    public int getMenuId() {
        return menuId;
    }

    public void setMenuId(int menuId) {
        this.menuId = menuId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CanteenMenuEntityPK that = (CanteenMenuEntityPK) o;
        return canteenId == that.canteenId &&
                menuId == that.menuId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(canteenId, menuId);
    }
}
