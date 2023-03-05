package sk.tuke.unicanteen.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sk.tuke.unicanteen.model.UserObjectEntity;

import java.util.List;

public interface UserJpaRepository extends JpaRepository<UserObjectEntity, Long> {

    @Query("SELECT u FROM UserObjectEntity u WHERE u.azureId = :azureId")
    UserObjectEntity findByAzureId(@Param("azureId") String azureId);

    @Query("SELECT u FROM UserObjectEntity u WHERE u.id = :id")
    UserObjectEntity findById(@Param("id") int id);
}
