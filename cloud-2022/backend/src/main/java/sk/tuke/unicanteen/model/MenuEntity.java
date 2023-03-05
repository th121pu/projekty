package sk.tuke.unicanteen.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "menu",  catalog = "postgres")
public class MenuEntity {
    private int id;
    private Timestamp date;
    private float price;
    private FoodEntity food;
    private Set<CanteenEntity> canteens;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "date")
    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    @Basic
    @Column(name = "price")
    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    @JoinColumn(name = "food_id")
    @ManyToOne(fetch = FetchType.EAGER)
    public FoodEntity getFood() {
        return food;
    }

    public void setFood(FoodEntity food) {
        this.food = food;
    }

    @JsonIgnore
    @ManyToMany(mappedBy = "menu")
    public Set<CanteenEntity> getMenu() {
        return canteens;
    }

    public void setMenu(Set<CanteenEntity> menu) {
        this.canteens = menu;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MenuEntity that = (MenuEntity) o;
        return id == that.id &&
                Float.compare(that.price, price) == 0 &&
                Objects.equals(date, that.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, price);
    }
}
