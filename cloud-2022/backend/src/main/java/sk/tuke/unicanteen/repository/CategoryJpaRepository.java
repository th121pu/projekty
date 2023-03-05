package sk.tuke.unicanteen.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sk.tuke.unicanteen.model.CategoryEntity;
import sk.tuke.unicanteen.model.UserObjectEntity;

public interface CategoryJpaRepository extends JpaRepository<CategoryEntity, Long> {

    @Query("SELECT c FROM CategoryEntity c WHERE c.name = :name")
    CategoryEntity findByName(@Param("name") String name);
}
