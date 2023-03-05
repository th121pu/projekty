package sk.tuke.unicanteen.model;


import java.sql.Timestamp;

public class NewOrder {

    private int userId;
    private int canteenId;
    private int menuId;
    private  boolean prepaid;
    private boolean picked;
    private Timestamp date;

    private String currentTenant;

    private String studentEmail;

    private String canteenEmail;

    public NewOrder(int userId, int canteenId, int menuId, boolean prepaid, boolean picked, String currentTenant, String studentEmail, String canteenEmail) {
        this.userId = userId;
        this.canteenId = canteenId;
        this.menuId = menuId;
        this.prepaid = prepaid;
        this.picked = picked;
        this.date = new Timestamp(System.currentTimeMillis());
        this.currentTenant = currentTenant;
        this.studentEmail = studentEmail;
        this.canteenEmail = canteenEmail;
    }
}
