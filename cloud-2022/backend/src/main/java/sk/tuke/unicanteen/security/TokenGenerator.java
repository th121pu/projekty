package sk.tuke.unicanteen.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class TokenGenerator {

    @Value("${jwt.signing.key}")
    public String SIGNING_KEY;

    @Value("${jwt.token.validity}")
    public long TOKEN_VALIDITY;

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(SIGNING_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    public String getAzureIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SIGNING_KEY)
                .parseClaimsJws(token)
                .getBody();
        if (isTokenExpired(token)) throw new ExpiredJwtException(null, claims, "Expired token.");
        return (String) claims.get("azureId");
    }

    public String getTenantIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SIGNING_KEY)
                .parseClaimsJws(token)
                .getBody();
        if (isTokenExpired(token)) throw new ExpiredJwtException(null, claims, "Expired token.");
        return (String) claims.get("tenant");
    }

    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SIGNING_KEY)
                .parseClaimsJws(token)
                .getBody();
        if (isTokenExpired(token)) throw new ExpiredJwtException(null, claims, "Expired token.");
        String roleId = (String) claims.get("role");
        if (roleId.equals("b6104f4c-1d63-4244-b57e-7c50662ccb19"))
            return "ADMIN";
        else {
            return "STUDENT";
        }
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public String generateNewToken(String tenantId, String roleId, String azureId) {
        String jws = Jwts.builder()
                .setIssuer("uni-canteen")
                .setSubject("token")
                .claim("tenant", tenantId)
                .claim("role", roleId)
                .claim("azureId", azureId)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY * 1000))
                .signWith(
                        SignatureAlgorithm.HS256,
                        SIGNING_KEY
                )
                .compact();
        System.out.println(jws);
        return jws;
    }


    public boolean validateToken(String token) {
        System.out.println("token validation " + token);
        final Claims claims = getAllClaimsFromToken(token);
        System.out.println(claims.getIssuedAt());
        System.out.println(claims.getExpiration());
        System.out.println(claims.get("tenant"));
        System.out.println(claims.get("role"));
        System.out.println(claims.get("azureId"));

        return !isTokenExpired(token);
    }

    UsernamePasswordAuthenticationToken getAuthenticationToken(final String token, final Authentication existingAuth) {
        final Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(getRoleFromToken(token).split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
        return new UsernamePasswordAuthenticationToken(null, null, authorities);
    }
}
