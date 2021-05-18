package sk.tuke.gamestudio.service.rest;

import org.junit.jupiter.api.Test;
import sk.tuke.gamestudio.entity.Rating;
import sk.tuke.gamestudio.service.RatingService;
import sk.tuke.gamestudio.service.exceptions.RatingException;
import sk.tuke.gamestudio.service.jdbc.ServiceInfo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class RatingServiceRestTest implements ServiceInfo {
    private static final String DELETE_RATINGS =
            "DELETE FROM rating WHERE game = 'blockpuzzle'";
    private RatingService service = new RatingServiceRestClient();

    @Test
    public void testEmptyDatabase() throws RatingException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_RATINGS)) {
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new RatingException("Error saving rating", e);
        }
        assertEquals(0, service.getAverageRating("blockpuzzle"));
    }


    @Test
    public void setRating() throws RatingException {
        Rating rating = new Rating("test", "blockpuzzle", 5, new Date());
        service.setRating(rating);
        assertEquals(5, service.getRating("blockpuzzle", "test"));
    }

    @Test
    public void testGetAvarage() throws RatingException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_RATINGS)) {
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new RatingException("Error saving rating", e);
        }
        Rating r = new Rating("test1", "blockpuzzle", 3, new Date());
        Rating r1 = new Rating("test2", "blockpuzzle", 5, new Date());

        service.setRating(r);
        service.setRating(r1);

        System.out.println(service.getAverageRating("blockpuzzle"));
        assertEquals(4, service.getAverageRating("blockpuzzle"));

    }
}
