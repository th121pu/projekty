package sk.tuke.unicanteen.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sk.tuke.unicanteen.model.AllOrdersEntity;
import sk.tuke.unicanteen.model.CanteenEntity;

import java.util.List;

public interface AllOrdersJpaRepository extends JpaRepository<AllOrdersEntity, Long>  {

    @Query("SELECT a FROM AllOrdersEntity a WHERE a.userObjectId = :userId")
    List<AllOrdersEntity> findByUserId(@Param("userId") int userId);

    @Query("SELECT a FROM AllOrdersEntity a WHERE a.canteen = :canteenEntity")
    List<AllOrdersEntity> findByCanteen(@Param("canteenEntity") CanteenEntity canteenEntity);
}
