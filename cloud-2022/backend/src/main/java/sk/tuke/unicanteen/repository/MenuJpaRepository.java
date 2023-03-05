package sk.tuke.unicanteen.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sk.tuke.unicanteen.model.MenuEntity;
import sk.tuke.unicanteen.model.UserObjectEntity;

public interface MenuJpaRepository extends JpaRepository<MenuEntity, Long> {
    @Query("SELECT m FROM MenuEntity m WHERE m.id = :id")
    MenuEntity findById(@Param("id") int id);
}
