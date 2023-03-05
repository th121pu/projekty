package sk.tuke.unicanteen.multitenancy;

import org.hibernate.engine.jdbc.connections.internal.DriverManagerConnectionProviderImpl;
import org.hibernate.engine.jdbc.connections.spi.AbstractMultiTenantConnectionProvider;
import org.hibernate.engine.jdbc.connections.spi.ConnectionProvider;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;

@Component
public class SchemaMultiTenantConnectionProvider extends AbstractMultiTenantConnectionProvider {
    private static final String HIBERNATE_PROPERTIES_PATH = "/application.properties";
    private Map<String, ConnectionProvider> connectionProviderMap;

    public SchemaMultiTenantConnectionProvider() {
        this.connectionProviderMap = new HashMap<>();
    }

    @Override
    public Connection getConnection(String tenantIdentifier) throws SQLException {
        Connection connection = super.getConnection(tenantIdentifier);
        connection.createStatement().execute(String.format("SET SCHEMA '%s';", tenantIdentifier));
        return connection;
    }

    @Override
    protected ConnectionProvider getAnyConnectionProvider() {
        return getConnectionProvider(TenantContext.DEFAULT_TENANT_ID);
    }

    @Override
    protected ConnectionProvider selectConnectionProvider(String tenantIdentifier) {
        return getConnectionProvider(tenantIdentifier);
    }

    private ConnectionProvider getConnectionProvider(String tenantIdentifier) {
        return Optional.ofNullable(tenantIdentifier)
                .map(connectionProviderMap::get)
                .orElseGet(() -> {
                    try {
                        return createNewConnectionProvider(tenantIdentifier);
                    } catch (Exception e) {
                        e.printStackTrace();
                        return null;
                    }
                });
    }

    private ConnectionProvider createNewConnectionProvider(String tenantIdentifier) throws Exception {
        return Optional.ofNullable(tenantIdentifier)
                .map(this::createConnectionProvider)
                .map(connectionProvider -> {
                    connectionProviderMap.put(tenantIdentifier, connectionProvider);
                    return connectionProvider;
                })
                .orElseThrow(() -> new Exception(String.format("Cannot create new connection provider for tenant: %s", tenantIdentifier)));
    }

    private ConnectionProvider createConnectionProvider(String tenantIdentifier) {
        return Optional.ofNullable(tenantIdentifier)
                .map(this::getHibernatePropertiesForTenantId)
                .map(this::initConnectionProvider)
                .orElse(null);
    }

    private Properties getHibernatePropertiesForTenantId(String tenantId) {
        try {
            Properties properties = new Properties();
            System.out.println(properties);
            properties.load(getClass().getResourceAsStream(HIBERNATE_PROPERTIES_PATH));
            return properties;
        } catch (IOException e) {
            throw new RuntimeException(String.format("Cannot open hibernate properties: %s)", HIBERNATE_PROPERTIES_PATH));
        }
    }

    private ConnectionProvider initConnectionProvider(Properties hibernateProperties) {
        DriverManagerConnectionProviderImpl connectionProvider = new DriverManagerConnectionProviderImpl();
        connectionProvider.configure(hibernateProperties);
        return connectionProvider;
    }

}