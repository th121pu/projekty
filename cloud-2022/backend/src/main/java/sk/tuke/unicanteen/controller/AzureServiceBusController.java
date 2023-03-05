package sk.tuke.unicanteen.controller;

import com.azure.messaging.servicebus.ServiceBusClientBuilder;
import com.azure.messaging.servicebus.ServiceBusMessage;
import com.azure.messaging.servicebus.ServiceBusSenderClient;
import com.google.gson.Gson;
import com.nimbusds.jose.shaded.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.WebApplicationContext;
import sk.tuke.unicanteen.model.MenuEntity;
import sk.tuke.unicanteen.model.NewOrder;
import sk.tuke.unicanteen.model.UserObjectEntity;
import sk.tuke.unicanteen.multitenancy.TenantContext;
import sk.tuke.unicanteen.repository.MenuJpaRepository;
import sk.tuke.unicanteen.repository.UserJpaRepository;
import sk.tuke.unicanteen.service.UserService;

@Controller
@RequestMapping("/sb")
@Scope(WebApplicationContext.SCOPE_SESSION)
public class AzureServiceBusController {
    @Autowired
    private UserJpaRepository userRepo;

    @Autowired
    private MenuJpaRepository menuRepo;

    static String connectionString = "Endpoint=sb://dominika-cloudy.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=rkO6KlNGRjFcJWyq5O9siZWQhSg7wr+hbkWGdyBKy0M=";

    @GetMapping("/createOrder")
    //@ResponseStatus(value = HttpStatus.OK)
    @ResponseBody
    public UserObjectEntity createOrder(@RequestParam int userId, @RequestParam int  canteenId, @RequestParam int menuId, @RequestParam boolean prepaid, @RequestParam boolean picked, @RequestParam String studentEmail, @RequestParam String canteenEmail) {

        UserObjectEntity currentUser = userRepo.findById(userId);
        MenuEntity chosenMenu = menuRepo.findById(menuId);
        if (prepaid) {
            Float oldBalanace = currentUser.getAccountBalance();
            System.out.println("OLD ACCOUNT BALANCE: ");
            System.out.println(oldBalanace);
            float menuPrice = chosenMenu.getPrice();
            System.out.println("MENU PRICE: ");
            System.out.println(menuPrice);
            float newAccBalance = oldBalanace - menuPrice;
            System.out.println("NEW ACC BALANCE: ");
            System.out.println(newAccBalance);
            currentUser.setAccountBalance(newAccBalance);
            userRepo.save(currentUser);
        }
        var message = new NewOrder(userId, canteenId, menuId, prepaid, picked, TenantContext.getCurrentTenant(), studentEmail, canteenEmail);
        String topicName = "create-new-order";
        // create a Service Bus Sender client for the queue
        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sender()
                .topicName(topicName)
                .buildClient();

        Gson gson = new Gson();
        String body = gson.toJson(message);
        System.out.println (body);

        // send one message to the topic
        senderClient.sendMessage(new ServiceBusMessage(body));
        System.out.println("Sent a single message to the topic: " + topicName);
        return currentUser;
    }

    @GetMapping("/notifyUsers")
    //@ResponseStatus(value = HttpStatus.OK)
    @ResponseBody
    public String notifyUsers(@RequestParam String message) {

        JSONObject json = new JSONObject();
        json.put("canteenEmail", "canteen.uni@gmail.com");
        json.put("tenant", TenantContext.getCurrentTenant());
        json.put("message", message);

        String topicName = "canteen-notification";
        // create a Service Bus Sender client for the queue
        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sender()
                .topicName(topicName)
                .buildClient();

        Gson gson = new Gson();
        String body = gson.toJson(json);

        // send one message to the topic
        senderClient.sendMessage(new ServiceBusMessage(body));
        System.out.println("Sent a single message to the topic: " + topicName);
        return body;
    }

    @GetMapping("/getReceipt")
    //@ResponseStatus(value = HttpStatus.OK)
    @ResponseBody
    public String getReceipt(@RequestParam int userId, @RequestParam String studentEmail) {

        JSONObject json = new JSONObject();
        json.put("userId", userId);
        json.put("tenant", TenantContext.getCurrentTenant());
        json.put("studentEmail", studentEmail);

        String topicName = "generate-user-receipt";
        // create a Service Bus Sender client for the queue
        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sender()
                .topicName(topicName)
                .buildClient();

        Gson gson = new Gson();
        String body = gson.toJson(json);

        // send one message to the topic
        senderClient.sendMessage(new ServiceBusMessage(body));
        System.out.println("Sent a single message to the topic: " + topicName);
        return body;
    }
}
