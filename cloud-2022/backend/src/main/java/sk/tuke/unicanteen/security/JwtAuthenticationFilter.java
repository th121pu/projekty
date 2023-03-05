package sk.tuke.unicanteen.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private TokenGenerator jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        String header = req.getHeader("token");
        String azureId = null;
        String authToken = null;
        if (header != null) {
            authToken = header;
            try {
                azureId = jwtTokenUtil.getAzureIdFromToken(authToken);
            } catch (IllegalArgumentException e) {
                logger.error("An error occurred while fetching AzureId from Token", e);
            } catch (ExpiredJwtException e) {
                logger.warn("The token has expired", e);
            } catch (SignatureException e) {
                logger.error("Authentication Failed. AzureId not valid.");
            }
        } else {
            logger.warn("Couldn't find bearer string, header will be ignored");
        }
        if (azureId != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            if (jwtTokenUtil.validateToken(authToken)) {
                UsernamePasswordAuthenticationToken authentication = jwtTokenUtil.getAuthenticationToken(authToken, SecurityContextHolder.getContext().getAuthentication());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                logger.info("authenticated user " + azureId + ", setting security context");
                System.out.println(authentication.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        chain.doFilter(req, res);
    }
}