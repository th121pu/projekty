package sk.tuke.unicanteen.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "all_orders", catalog = "postgres")
public class AllOrdersEntity {
    private int id;
    private int userObjectId;
    //private int canteenId;
    //private int menuId;
    private boolean prepaid;
    private boolean picked;
    private CanteenEntity canteen;
    private MenuEntity ordersMenu;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Column(name = "user_object_id")
    public int getUserObjectId() {
        return userObjectId;
    }

    public void setUserObjectId(int userObjectId) {
        this.userObjectId = userObjectId;
    }

//    @Column(name = "canteen_id")
//    public int getCanteenId() {
//        return canteenId;
//    }
//
//    public void setCanteenId(int canteenId) {
//        this.canteenId = canteenId;
//    }
//
//    @Column(name = "menu_id")
//    public int getMenuId() {
//        return menuId;
//    }
//
//    public void setMenuId(int menuId) {
//        this.menuId = menuId;
//    }

    @Basic
    @Column(name = "prepaid")
    public boolean getPrepaid() {
        return prepaid;
    }

    public void setPrepaid(boolean prepaid) {
        this.prepaid = prepaid;
    }

    @Basic
    @Column(name = "picked")
    public boolean getPicked() {
        return picked;
    }

    public void setPicked(boolean picked) {
        this.picked = picked;
    }
    
    @JoinColumn(name = "canteen_id")
    @ManyToOne(fetch = FetchType.EAGER)
    public CanteenEntity getCanteen() {
        return canteen;
    }

    public void setCanteen(CanteenEntity canteen) {
        this.canteen = canteen;
    }

    @JoinColumn(name = "menu_id")
    @ManyToOne(fetch = FetchType.EAGER)
    public MenuEntity getOrdersMenu() {
        return ordersMenu;
    }

    public void setOrdersMenu(MenuEntity ordersMenu) {
        this.ordersMenu = ordersMenu;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AllOrdersEntity that = (AllOrdersEntity) o;
        return userObjectId == that.userObjectId &&
                canteen == that.canteen &&
                Objects.equals(picked, that.picked) &&
                Objects.equals(prepaid, that.prepaid) &&
                ordersMenu == that.ordersMenu;
    }

    @Override
    public int hashCode() {
        return Objects.hash(userObjectId, canteen, ordersMenu);
    }
}
