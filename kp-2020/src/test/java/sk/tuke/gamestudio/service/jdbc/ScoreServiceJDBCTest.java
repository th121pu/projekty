package sk.tuke.gamestudio.service.jdbc;


import org.junit.jupiter.api.Test;
import sk.tuke.gamestudio.entity.Score;
import sk.tuke.gamestudio.service.exceptions.ScoreException;
import sk.tuke.gamestudio.service.jdbc.ScoreServiceJDBC;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class ScoreServiceJDBCTest {

    private ScoreServiceJDBC service = new ScoreServiceJDBC();

    @Test
    public void testEmptyDatabase() throws ScoreException {
        service.deleteScores(new Score("blockpuzzle", "fero", 10, new Date()));
        assertEquals(0, service.getBestScores("blockpuzzle").size());
    }


    @Test
    public void addScore() throws ScoreException {
        service.deleteScores(new Score("blockpuzzle", "fero", 10, new Date()));
        Score score = new Score("blockpuzzle","Zuzka", 123456,  new Date());
        score.setIdent(14);
        service.addScore(score);
        assertEquals(1, service.getBestScores("blockpuzzle").size());
    }

    @Test
    public void testGetBestScores() throws ScoreException {
        service.deleteScores(new Score("blockpuzzle", "fero", 10, new Date()));
        Score s1 = new Score("blockpuzzle", "ferrrro", 150, new Date());
        Score s2 = new Score("blockpuzzle", "meno", 300, new Date());
        s1.setIdent(14);
        s1.setIdent(15);
        service.addScore(s1);
        service.addScore(s2);

        List<Score> scores = service.getBestScores("blockpuzzle");
        assertEquals(s2.getPoints(), scores.get(0).getPoints());
        assertEquals(s2.getPlayer(), scores.get(0).getPlayer());
    }

}
