package sk.tuke.unicanteen.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@ControllerAdvice
public class UnauthorizedEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        // 401
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getOutputStream().println("{ \"error\": \"" + "Authentication failed." + "\" }");
    }

    @ExceptionHandler(value = {AccessDeniedException.class})
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AccessDeniedException accessDeniedException) throws IOException {
        // 403
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getOutputStream().println("{ \"error\": \"" + "Authorization Failed. You do not have sufficient rights for this request." + "\" }");
    }

    @ExceptionHandler(value = {Exception.class})
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         Exception exception) throws IOException {
        // 500
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getOutputStream().println("{ \"error\": \"" + "Internal Server Error. Bad request." + "\" }");
    }
}