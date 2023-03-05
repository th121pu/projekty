package sk.tuke.unicanteen.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "school", catalog = "postgres")
public class SchoolEntity {
    private int id;
    private String name;
    private String address;
    private String contact;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SchoolEntity that = (SchoolEntity) o;
        return id == that.id &&
                Objects.equals(name, that.name) &&
                Objects.equals(address, that.address) &&
                Objects.equals(contact, that.contact);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, address, contact);
    }
}
