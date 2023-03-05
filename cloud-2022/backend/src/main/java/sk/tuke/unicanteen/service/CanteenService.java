package sk.tuke.unicanteen.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sk.tuke.unicanteen.model.*;
import sk.tuke.unicanteen.repository.*;

import java.sql.Timestamp;
import java.util.Optional;

@Service
public class CanteenService {

    @Autowired
    private CanteenJpaRepository canteenRepo;

    @Autowired
    private CategoryJpaRepository categoryRepo;

    @Autowired
    private FoodJpaRepository foodRepo;

    @Autowired
    private MenuJpaRepository menuRepo;

    @Autowired
    private CanteenMenuJpaRepository canteenMenuJpaRepository;

    @Autowired
    private SchoolJpaRepository schoolRepo;


    public CanteenMenuEntity createCanteenMenu(int canteenId, String foodName, float price,
                                           Timestamp timestamp, String category) {

        // get or create category
        CategoryEntity categoryResult;
        Optional<CategoryEntity> categoryOpt = Optional.ofNullable(categoryRepo.findByName(category));
        if (categoryOpt.isPresent()) {
            categoryResult = categoryOpt.get();
        }
        else {
            CategoryEntity categoryEntity = new CategoryEntity();
            categoryEntity.setName(category);
            categoryResult = categoryRepo.save(categoryEntity);
        }

        // get or create food
        FoodEntity foodResult;
        Optional<FoodEntity> foodOpt = Optional.ofNullable(foodRepo.findByNameAndCategory(foodName, categoryResult));
        if (foodOpt.isPresent()) {
            foodResult = foodOpt.get();
        }
        else {
            FoodEntity foodEntity = new FoodEntity();
            foodEntity.setName(foodName);
            foodEntity.setCategory(categoryResult);
            foodResult = foodRepo.save(foodEntity);
        }

        // create menu
        MenuEntity menuEntity = new MenuEntity();
        menuEntity.setDate(timestamp);
        menuEntity.setFood(foodResult);
        menuEntity.setPrice(price);
        MenuEntity menuResult = menuRepo.save(menuEntity);

        // create canteen menu
        CanteenMenuEntity canteenMenuEntity = new CanteenMenuEntity();
        canteenMenuEntity.setCanteenId(canteenId);
        canteenMenuEntity.setMenuId(menuResult.getId());

        return canteenMenuJpaRepository.save(canteenMenuEntity);
    }

    public void deleteCanteenMenu(int canteenId, int menuId) {
        Optional<CanteenMenuEntity> canteenMenuOpt =
                Optional.ofNullable(canteenMenuJpaRepository.findByCanteenIdAndMenuId(canteenId, menuId));
        canteenMenuOpt.ifPresent(canteenMenuEntity -> canteenMenuJpaRepository.delete(canteenMenuEntity));
    }

    public CanteenEntity insertCanteen(CanteenEntity canteenEntity) {
        SchoolEntity schoolEntity = schoolRepo.findTopByOrderByNameDesc();
        canteenEntity.setSchool(schoolEntity);
        return canteenRepo.save(canteenEntity);
    }

    public CanteenEntity updateCanteen(CanteenEntity canteenEntity) {
        Optional<CanteenEntity> canteen =
                Optional.ofNullable(canteenRepo.findById(canteenEntity.getId()));
        if (canteen.isPresent()) {
            CanteenEntity newCanteen = canteen.get();
            newCanteen.setAddress(canteenEntity.getAddress());
            newCanteen.setContact(canteenEntity.getContact());
            newCanteen.setOpeningHours(canteenEntity.getOpeningHours());
            newCanteen.setName(canteenEntity.getName());
            return canteenRepo.save(newCanteen);
        }

    return null;
    }

}
