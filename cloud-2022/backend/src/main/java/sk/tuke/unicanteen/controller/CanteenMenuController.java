package sk.tuke.unicanteen.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.WebApplicationContext;
import sk.tuke.unicanteen.model.CanteenMenuEntity;
import sk.tuke.unicanteen.model.MenuEntity;
import sk.tuke.unicanteen.multitenancy.TenantContext;
import sk.tuke.unicanteen.repository.CanteenJpaRepository;
import sk.tuke.unicanteen.service.CanteenService;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/canteen-menu" )
@Scope(WebApplicationContext.SCOPE_SESSION)
public class CanteenMenuController {

    @Autowired
    private CanteenJpaRepository canteenRepo;

    @Autowired
    private CanteenService canteenService;

    // REDIS TEST
    @Autowired
    private StringRedisTemplate redisTemplate;

    @GetMapping("/getCanteenMenu")
    @ResponseBody
    public List<List<MenuEntity>> getCanteenMenu(@RequestParam int id, @RequestParam String date) {
        Timestamp timestamp = null;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date parsedDate = dateFormat.parse(date);
            timestamp = new java.sql.Timestamp(parsedDate.getTime());
        } catch(Exception e) {
            System.out.println(e.getMessage());
        }

        final Timestamp finalTimestamp = timestamp;
        Set<MenuEntity> menus = canteenRepo.findById(id).getMenu();
        List<MenuEntity> menusFromDate = new ArrayList<>();
        for (MenuEntity menu: menus) {
            if (menu.getDate().equals(finalTimestamp)) menusFromDate.add(menu);
        }

        List<List<MenuEntity>> groupedMenu = new ArrayList<>(
                menusFromDate.stream()
                        .collect(Collectors.groupingBy(a -> a.getFood().getCategory()))
                        .values());

        return groupedMenu;

        // HEADER musi mat token
    }

    @GetMapping("/getCanteenMenuWithRedis")
    @ResponseBody
    public String getCanteenMenuWithRedis(@RequestParam int id, @RequestParam String date) throws JsonProcessingException {

        String result = "";
        ValueOperations<String, String> ops = this.redisTemplate.opsForValue();
        String key = id + "/" + date + "/" + TenantContext.getCurrentTenant();

        if (this.redisTemplate.hasKey(key)) result = ops.get(key);
        else {
            Timestamp timestamp = null;
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date parsedDate = dateFormat.parse(date);
                timestamp = new java.sql.Timestamp(parsedDate.getTime());
            } catch(Exception e) {
                System.out.println(e.getMessage());
            }

            final Timestamp finalTimestamp = timestamp;
            Set<MenuEntity> menus = canteenRepo.findById(id).getMenu();
            List<MenuEntity> menusFromDate = new ArrayList<>();
            for (MenuEntity menu: menus) {
                if (menu.getDate().equals(finalTimestamp)) menusFromDate.add(menu);
            }

            List<List<MenuEntity>> groupedMenu = new ArrayList<>(
                    menusFromDate.stream()
                            .collect(Collectors.groupingBy(a -> a.getFood().getCategory()))
                            .values());

            System.out.println("redis doesnt have menu for this day");

            if (groupedMenu.size() > 0) {
                System.out.println("adding to redis for " + key);
                ObjectMapper mapper = new ObjectMapper();
                result = mapper.writeValueAsString(groupedMenu);
                ops.set(key, result);
            }
        }

        return result;
        // HEADER musi mat token
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PostMapping("/admin/addCanteenMenu")
    @ResponseBody
    public List<List<MenuEntity>> addCanteenMenu(@RequestParam int canteenId, @RequestParam String menuName,
                                           @RequestParam Float price, @RequestParam String date,
                                           @RequestParam String category) throws JsonProcessingException {
        Timestamp timestamp = null;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date parsedDate = dateFormat.parse(date);
            timestamp = new java.sql.Timestamp(parsedDate.getTime());
        } catch(Exception e) {
            System.out.println(e.getMessage());
        }

        canteenService.createCanteenMenu(canteenId, menuName, price, timestamp, category);

        List<List<MenuEntity>> updatedMenu = getCanteenMenu(canteenId, date);
        //update in redis
        ValueOperations<String, String> ops = this.redisTemplate.opsForValue();
        String key = canteenId + "/" + date + "/" + TenantContext.getCurrentTenant();

        ObjectMapper mapper = new ObjectMapper();
        String result = mapper.writeValueAsString(updatedMenu);
        ops.set(key, result);

        return updatedMenu;
        // HEADER musi mat token
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/admin/deleteCanteenMenu")
    @ResponseBody
    public List<List<MenuEntity>> deleteCanteenMenu(@RequestParam int canteenId, @RequestParam int menuId,
                                              @RequestParam String date) throws JsonProcessingException {

        canteenService.deleteCanteenMenu(canteenId, menuId);

        List<List<MenuEntity>> updatedMenu = getCanteenMenu(canteenId, date);
        //update in redis
        ValueOperations<String, String> ops = this.redisTemplate.opsForValue();
        String key = canteenId + "/" + date + "/" + TenantContext.getCurrentTenant();

        ObjectMapper mapper = new ObjectMapper();
        String result = mapper.writeValueAsString(updatedMenu);
        ops.set(key, result);

        return updatedMenu;
        // HEADER musi mat token
    }
}
