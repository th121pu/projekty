package sk.tuke.unicanteen.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sk.tuke.unicanteen.model.CategoryEntity;
import sk.tuke.unicanteen.model.FoodEntity;

public interface FoodJpaRepository extends JpaRepository<FoodEntity, Long> {

    @Query("SELECT f FROM FoodEntity f WHERE f.name = :name AND f.category = :category")
    FoodEntity findByNameAndCategory(@Param("name") String name,
                                         @Param("category") CategoryEntity category);
}
