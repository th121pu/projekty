package sk.tuke.gamestudio.service.jdbc;

import org.junit.jupiter.api.Test;
import sk.tuke.gamestudio.entity.Rating;
import sk.tuke.gamestudio.service.exceptions.RatingException;
import sk.tuke.gamestudio.service.jdbc.RatingServiceJDBC;


import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class RatingServiceJDBCTest {

    private RatingServiceJDBC service = new RatingServiceJDBC();

    @Test
    public void testEmptyDatabase() throws RatingException {
        service.deleteRatings(new Rating("fere", "blockpuzzle", 4, new Date()));
        assertEquals(0, service.getAverageRating("blockpuzzle"));
    }


    @Test
    public void setRating() throws RatingException {
        Rating rating = new Rating("test", "blockpuzzle", 5, new Date());
        rating.setIdent(998);
        service.setRating(rating);
        assertEquals(5, service.getRating("blockpuzzle", "test"));
    }

    @Test
    public void testGetAvarage() throws RatingException {
        service.deleteRatings(new Rating("fere", "blockpuzzle", 3, new Date()));
        Rating r = new Rating("test1", "blockpuzzle", 3, new Date());
        Rating r1 = new Rating("test2", "blockpuzzle", 5, new Date());
        r.setIdent(999);
        r1.setIdent(99);

        service.setRating(r);
        service.setRating(r1);

        System.out.println(service.getAverageRating("blockpuzzle"));
        assertEquals(4, service.getAverageRating("blockpuzzle"));

    }
}
