package sk.tuke.unicanteen.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "canteen", catalog = "postgres")
public class CanteenEntity {
    private int id;
    private String name;
    private String address;
    private String contact;
    private String openingHours;
    private Set<MenuEntity> menu;
    private SchoolEntity school;

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
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "address")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Basic
    @Column(name = "contact")
    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    @Basic
    @Column(name = "opening_hours")
    public String getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(String openingHours) {
        this.openingHours = openingHours;
    }

    @JoinColumn(name = "school_id")
    @ManyToOne(fetch = FetchType.EAGER)
    public SchoolEntity getSchool() {
        return school;
    }

    public void setSchool(SchoolEntity school) {
        this.school = school;
    }

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "canteen_menu",
            joinColumns = @JoinColumn(name = "canteen_id"),
            inverseJoinColumns = @JoinColumn(name = "menu_id"))
    public Set<MenuEntity> getMenu() {
        return menu;
    }

    public void setMenu(Set<MenuEntity> menu) {
         this.menu = menu;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CanteenEntity that = (CanteenEntity) o;
        return id == that.id &&
                Objects.equals(name, that.name) &&
                Objects.equals(address, that.address) &&
                Objects.equals(contact, that.contact) &&
                Objects.equals(openingHours, that.openingHours);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, address, contact, openingHours);
    }
}
