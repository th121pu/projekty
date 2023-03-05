package sk.tuke.unicanteen.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "canteen_menu", catalog = "postgres")
@IdClass(CanteenMenuEntityPK.class)
public class CanteenMenuEntity {
    private int canteenId;
    private int menuId;

    @Id
    @Column(name = "canteen_id")
    public int getCanteenId() {
        return canteenId;
    }

    public void setCanteenId(int canteenId) {
        this.canteenId = canteenId;
    }

    @Id
    @Column(name = "menu_id")
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
        CanteenMenuEntity that = (CanteenMenuEntity) o;
        return canteenId == that.canteenId &&
                menuId == that.menuId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(canteenId, menuId);
    }
}
