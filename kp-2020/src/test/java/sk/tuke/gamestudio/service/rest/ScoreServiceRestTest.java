package sk.tuke.gamestudio.service.rest;

import org.junit.jupiter.api.Test;
import sk.tuke.gamestudio.entity.Score;
import sk.tuke.gamestudio.service.ScoreService;
import sk.tuke.gamestudio.service.exceptions.ScoreException;
import sk.tuke.gamestudio.service.jdbc.ServiceInfo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ScoreServiceRestTest implements ServiceInfo {
    private static final String DELETE_SCORES =
            "DELETE FROM score WHERE game = 'blockpuzzle'";
    private ScoreService service = new ScoreServiceRestClient();

    @Test
    public void testEmptyDatabase() throws ScoreException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_SCORES)) {
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new ScoreException("Error saving score", e);
        }
        assertEquals(0, service.getBestScores("blockpuzzle").size());
    }


    @Test
    public void addScore() throws ScoreException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_SCORES)) {
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new ScoreException("Error saving score", e);
        }
        Score score = new Score("blockpuzzle", "Zuzka", 123456, new Date());
        service.addScore(score);
        assertEquals(1, service.getBestScores("blockpuzzle").size());
    }

    @Test
    public void testGetBestScores() throws ScoreException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_SCORES)) {
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new ScoreException("Error saving score", e);
        }
        Score s1 = new Score("blockpuzzle", "ferrrro", 150, new Date());
        Score s2 = new Score("blockpuzzle", "meno", 300, new Date());
        service.addScore(s1);
        service.addScore(s2);

        List<Score> scores = service.getBestScores("blockpuzzle");
        assertEquals(s2.getPoints(), scores.get(0).getPoints());
        assertEquals(s2.getPlayer(), scores.get(0).getPlayer());
    }
}
