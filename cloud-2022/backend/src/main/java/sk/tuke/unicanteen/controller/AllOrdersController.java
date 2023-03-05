package sk.tuke.unicanteen.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.WebApplicationContext;
import sk.tuke.unicanteen.model.AllOrdersEntity;
import sk.tuke.unicanteen.model.CanteenEntity;
import sk.tuke.unicanteen.repository.AllOrdersJpaRepository;
import sk.tuke.unicanteen.repository.CanteenJpaRepository;
import sk.tuke.unicanteen.repository.UserJpaRepository;
import sk.tuke.unicanteen.security.TokenGenerator;

import java.util.List;

@Controller
@RequestMapping("/orders" )
@Scope(WebApplicationContext.SCOPE_SESSION)
public class AllOrdersController {

    @Autowired
    private AllOrdersJpaRepository allOrdersRepo;

    @Autowired
    private UserJpaRepository userRepo;

    @Autowired
    private CanteenJpaRepository canteenRepo;

    @Autowired
    private TokenGenerator tokenGenerator;


    @GetMapping("/getCurrentUserOrders")
    @ResponseBody
    public List<AllOrdersEntity> getCurrentUserOrders(@RequestHeader("token") String token) {
        return allOrdersRepo.findByUserId(
                userRepo.findByAzureId(tokenGenerator.getAzureIdFromToken(token)).getId());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/admin/getUserOrders")
    @ResponseBody
    public List<AllOrdersEntity> getUserOrders(@RequestParam int userId) {
        return allOrdersRepo.findByUserId(userId);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/admin/getCanteenOrders")
    @ResponseBody
    public List<AllOrdersEntity> getCanteenOrders(@RequestParam int canteenId) {
        CanteenEntity canteenEntity = canteenRepo.findById(canteenId);
        return allOrdersRepo.findByCanteen(canteenEntity);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/admin/getAll")
    @ResponseBody
    public List<AllOrdersEntity> getAll() {
        return allOrdersRepo.findAll();
    }
}
