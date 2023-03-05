package sk.tuke.unicanteen.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.JoinFormula;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "user_object", catalog = "postgres")
public class UserObjectEntity {
    private int id;
    private String azureId;
    private String name;
    private String isic;
    private String username;
    private String alternativeEmail;
    private Float accountBalance;
    private String role;
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
    @Column(name = "azure_id")
    public String getAzureId() {
        return azureId;
    }

    public void setAzureId(String azureId) {
        this.azureId = azureId;
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
    @Column(name = "isic")
    public String getIsic() {
        return isic;
    }

    public void setIsic(String isic) {
        this.isic = isic;
    }

    @Basic
    @Column(name = "username")
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Basic
    @Column(name = "alternative_email")
    public String getAlternativeEmail() {
        return alternativeEmail;
    }

    public void setAlternativeEmail(String alternativeEmail) {
        this.alternativeEmail = alternativeEmail;
    }

    @Basic
    @Column(name = "account_balance")
    public Float getAccountBalance() {
        return accountBalance;
    }

    public void setAccountBalance(Float accountBalance) {
        this.accountBalance = accountBalance;
    }

    @Basic
    @Column(name = "role")
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @JoinColumn(name = "school_id")
    @ManyToOne(fetch = FetchType.EAGER)
    public SchoolEntity getSchool() {
        return school;
    }

    public void setSchool(SchoolEntity school) {
        this.school = school;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserObjectEntity that = (UserObjectEntity) o;
        return id == that.id &&
                Objects.equals(azureId, that.azureId) &&
                Objects.equals(name, that.name) &&
                Objects.equals(isic, that.isic) &&
                Objects.equals(username, that.username) &&
                Objects.equals(alternativeEmail, that.alternativeEmail) &&
                Objects.equals(accountBalance, that.accountBalance) &&
                Objects.equals(role, that.role);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, azureId, name, isic, username, alternativeEmail, accountBalance, role);
    }
}
