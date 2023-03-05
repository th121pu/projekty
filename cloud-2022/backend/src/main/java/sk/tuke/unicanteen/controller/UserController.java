package sk.tuke.unicanteen.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.WebApplicationContext;
import sk.tuke.unicanteen.security.TokenGenerator;
import sk.tuke.unicanteen.model.UserObjectEntity;
import sk.tuke.unicanteen.repository.UserJpaRepository;
import sk.tuke.unicanteen.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@Controller
@RequestMapping("/user" )
@Scope(WebApplicationContext.SCOPE_SESSION)
public class UserController {

    @Autowired
    private UserJpaRepository userRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private TokenGenerator tokenGenerator;


    @PostMapping("/verifyUser" )
    @ResponseBody
    public String verifyActiveDirectoryUser(@RequestBody Map<String, Object> userObject) {
        Optional<UserObjectEntity> userOpt = Optional.ofNullable(userRepo.findByAzureId((String) userObject.get("id" )));
        if (userOpt.isPresent()) {
            userService.updateRole(userOpt.get(), (String) userObject.get("roleId" ));
            userService.updateMail(userOpt.get(), (String) userObject.get("mail" ));
            String token = tokenGenerator.generateNewToken((String) userObject.get("tenantId" ),
                    (String) userObject.get("roleId" ), (String) userObject.get("id" ));
            //tokenGenerator.validateToken(token);
            return token;
        } else {
            userService.insertUser(userObject);
            String token = tokenGenerator.generateNewToken((String) userObject.get("tenantId" ),
                    (String) userObject.get("roleId" ), (String) userObject.get("id" ));
            //tokenGenerator.validateToken(token);
            return token;
        }

        //EXAMPLE:
        //        {
        //             "displayName": "Admin Jedalne",
        //             "mail": null,
        //             "userPrincipalName": "admin@tuke2.onmicrosoft.com",
        //             "id": "f2af89cb-01c4-4180-8617-802779b2fedb",
        //             "tenantId": "91805668-f79d-4291-8f91-77f842032c20",
        //             "role": "b6104f4c-1d63-4244-b57e-7c50662ccb19"
        //        }

        // HEADER musi mat tenantId
    }

    @GetMapping("/getCurrentUser")
    @ResponseBody
    public UserObjectEntity getCurrentUser(@RequestHeader("token") String token) {
        return userRepo.findByAzureId(tokenGenerator.getAzureIdFromToken(token));

        // HEADER musi mat token
    }


    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/admin/getAllUsers")
    @ResponseBody
    public List<UserObjectEntity> getAllUsers() {
        return userRepo.findAll();

        // HEADER musi mat token
    }
}
