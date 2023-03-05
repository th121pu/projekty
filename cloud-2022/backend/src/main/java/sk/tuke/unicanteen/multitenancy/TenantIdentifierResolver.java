package sk.tuke.unicanteen.multitenancy;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver {

    static final String DEFAULT_TENANT = "tuke_canteens";

    @Override
    public String resolveCurrentTenantIdentifier() {
        return Optional.ofNullable(TenantContext.getCurrentTenant())
                .orElse(TenantContext.DEFAULT_TENANT_ID);
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}