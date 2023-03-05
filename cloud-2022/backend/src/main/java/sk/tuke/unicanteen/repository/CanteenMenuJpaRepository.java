package sk.tuke.unicanteen.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sk.tuke.unicanteen.model.CanteenMenuEntity;
import sk.tuke.unicanteen.model.UserObjectEntity;

public interface CanteenMenuJpaRepository extends JpaRepository<CanteenMenuEntity, Long> {

    @Query("SELECT c FROM CanteenMenuEntity c WHERE c.canteenId = :canteenId AND c.menuId = :menuId")
    CanteenMenuEntity findByCanteenIdAndMenuId(@Param("canteenId") int canteenId, @Param("menuId") int menuId);
}
