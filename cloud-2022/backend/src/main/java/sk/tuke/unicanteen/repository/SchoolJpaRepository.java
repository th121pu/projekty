package sk.tuke.unicanteen.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sk.tuke.unicanteen.model.SchoolEntity;
import sk.tuke.unicanteen.model.UserObjectEntity;

public interface SchoolJpaRepository extends JpaRepository<SchoolEntity, Long> {

    SchoolEntity findTopByOrderByNameDesc();
}
