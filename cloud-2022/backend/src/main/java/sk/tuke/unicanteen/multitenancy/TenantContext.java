package sk.tuke.unicanteen.multitenancy;

public abstract class TenantContext {

    public static final String DEFAULT_TENANT_ID = "tuke_canteens";
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();

    public static void setCurrentTenant(String tenant) {
        currentTenant.set(tenant);
    }

    public static String getCurrentTenant() {
        return currentTenant.get();
    }

    public static void clear() {
        currentTenant.remove();
    }

}