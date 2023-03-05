package sk.tuke.unicanteen.multitenancy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.AsyncHandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import sk.tuke.unicanteen.security.TokenGenerator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class TenantRequestInterceptor implements AsyncHandlerInterceptor {

    @Autowired
    private TokenGenerator tokenGenerator;

    @Value("${tenant.tuke}")
    public String TUKE_ID;

    @Value("${tenant.upjs}")
    public String UPJS_ID;

    public TenantRequestInterceptor() {
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String tenantId = "";

        if (request.getHeader("token") != null)
            tenantId = tokenGenerator.getTenantIdFromToken(request.getHeader("token"));
        else tenantId = request.getHeader("tenantId");

        System.out.println(tenantId);
        if (tenantId == null) return true;
        if (tenantId.equals(TUKE_ID)) {
            setTenantContext("tuke_canteens");
            System.out.println("tuke_canteens schema selected");
        } else if (tenantId.equals(UPJS_ID)) {
            setTenantContext("upjs_canteens");
            System.out.println("upjs_canteens schema selected");
        } else {
            setTenantContext("ERROR");
            System.out.println("you are not from any of valid organizations");
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
        TenantContext.clear();
    }

    private boolean setTenantContext(String tenant) {
        TenantContext.setCurrentTenant(tenant);
        return true;
    }
}