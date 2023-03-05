package sk.tuke.unicanteen.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sk.tuke.unicanteen.model.SchoolEntity;
import sk.tuke.unicanteen.model.UserObjectEntity;
import sk.tuke.unicanteen.repository.SchoolJpaRepository;
import sk.tuke.unicanteen.repository.UserJpaRepository;

import java.util.Map;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserJpaRepository userRepo;

    @Autowired
    private SchoolJpaRepository schoolRepo;

    public UserObjectEntity insertUser(Map<String, Object> userObject) {
        UserObjectEntity result;

        UserObjectEntity userEntity = new UserObjectEntity();
        userEntity.setUsername((String) userObject.get("userPrincipalName"));
        userEntity.setName((String) userObject.get("displayName"));
        userEntity.setAlternativeEmail((String) userObject.get("mail"));
        userEntity.setAzureId((String) userObject.get("id"));

        userEntity.setAccountBalance(0.0f);

        SchoolEntity schoolEntity = schoolRepo.findTopByOrderByNameDesc();
        userEntity.setSchool(schoolEntity);

        if (userObject.get("roleId").equals("b6104f4c-1d63-4244-b57e-7c50662ccb19")) {
            userEntity.setRole("ADMIN");
        }
        else {
            userEntity.setRole("STUDENT");
            userEntity.setIsic("S421" + generateRandomNumbers() + "Q");
        }

        result = userRepo.save(userEntity);
        return result;
    }

    private String generateRandomNumbers() {
        int min = 1;
        int max = 9;

        Random random = new Random();

        StringBuilder value = new StringBuilder();

        for (int i = 0; i < 10; i++)
            value.append(random.nextInt(max - min + 1) + min);

        return String.valueOf(value);
    }

    public UserObjectEntity updateRole(UserObjectEntity userObject, String roleId) {
        if (roleId.equals("b6104f4c-1d63-4244-b57e-7c50662ccb19") && !userObject.getRole().equals("ADMIN")) {
            userObject.setRole("ADMIN");
            userObject.setIsic(null);
        }
        if (!roleId.equals("b6104f4c-1d63-4244-b57e-7c50662ccb19") && userObject.getRole().equals("ADMIN")) {
            userObject.setRole("STUDENT");
            userObject.setIsic("S421" + generateRandomNumbers() + "Q");
        }

        return userRepo.save(userObject);
    }

    public UserObjectEntity updateMail(UserObjectEntity userObject, String mail) {
        if (mail == null) return null;
        if (!mail.equals(userObject.getAlternativeEmail())) userObject.setAlternativeEmail(mail);

        return userRepo.save(userObject);
    }

}
