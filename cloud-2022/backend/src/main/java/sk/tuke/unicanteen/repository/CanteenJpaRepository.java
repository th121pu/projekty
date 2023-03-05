package sk.tuke.unicanteen.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sk.tuke.unicanteen.model.CanteenEntity;
import sk.tuke.unicanteen.model.SchoolEntity;
import sk.tuke.unicanteen.model.UserObjectEntity;

public interface CanteenJpaRepository extends JpaRepository<CanteenEntity, Long>  {

    @Query("SELECT c FROM CanteenEntity c WHERE c.id = :id")
    CanteenEntity findById(@Param("id") int id);
}
