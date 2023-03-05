package sk.tuke.unicanteen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;



@Configuration
@EntityScan("sk.tuke.unicanteen.model")
@EnableJpaRepositories("sk.tuke.unicanteen.repository")
@SpringBootApplication()
public class UniCanteenApplication {


	public static void main(String[] args) {
		SpringApplication.run(UniCanteenApplication.class, args);
	}

}
