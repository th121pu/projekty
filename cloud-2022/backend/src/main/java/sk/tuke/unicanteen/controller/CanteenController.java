package sk.tuke.unicanteen.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.WebApplicationContext;
import sk.tuke.unicanteen.model.CanteenEntity;
import sk.tuke.unicanteen.repository.CanteenJpaRepository;
import sk.tuke.unicanteen.service.CanteenService;
import sk.tuke.unicanteen.service.UserService;

import java.util.*;

@Controller
@RequestMapping("/canteen" )
@Scope(WebApplicationContext.SCOPE_SESSION)
public class CanteenController {

    @Autowired
    private CanteenJpaRepository canteenRepo;

    @Autowired
    private CanteenService canteenService;

    @GetMapping("/getAllCanteens")
    @ResponseBody
    public List<CanteenEntity> getAllCanteens() {
        return canteenRepo.findAll();

        // HEADER musi mat token
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/admin/updateCanteen")
    @ResponseBody
    public CanteenEntity updateCanteen(@RequestBody CanteenEntity canteenObject) {
        return canteenService.updateCanteen(canteenObject);

        // HEADER musi mat token
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PostMapping("/admin/createCanteen")
    @ResponseBody
    public CanteenEntity createCanteen(@RequestBody CanteenEntity canteenObject) {
        return canteenService.insertCanteen(canteenObject);
        // HEADER musi mat token
    }

    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @DeleteMapping("/admin/deleteCanteen")
    @ResponseBody
    public void deleteCanteen(@RequestBody CanteenEntity canteenObject) {
        canteenRepo.delete(canteenObject);
        // HEADER musi mat token
    }


}
