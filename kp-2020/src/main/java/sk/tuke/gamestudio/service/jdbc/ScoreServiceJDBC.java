package sk.tuke.gamestudio.service.jdbc;


import sk.tuke.gamestudio.entity.Score;
import sk.tuke.gamestudio.service.ScoreService;
import sk.tuke.gamestudio.service.exceptions.ScoreException;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;


public class ScoreServiceJDBC implements ScoreService, ServiceInfo {

    private static final String INSERT_SCORE =
            "INSERT INTO score (game, player, points, played_on, ident) VALUES (?, ?, ?, ?, ?)";

    private static final String SELECT_SCORE =
            "SELECT game, player, points, played_on FROM score WHERE game = ? ORDER BY points DESC LIMIT 10;";

    private static final String DELETE_SCORE =
            "DELETE FROM score WHERE game =?";


    @Override
    public void addScore(Score score) throws ScoreException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(INSERT_SCORE)) {
                ps.setString(1, score.getGame());
                ps.setString(2, score.getPlayer());
                ps.setInt(3, score.getPoints());
                ps.setDate(4, new Date(score.getPlayedOn().getTime()));
                ps.setInt(5, score.getIdent());

                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new ScoreException("Error saving score", e);
        }
    }

    @Override
    public List<Score> getBestScores(String game) throws ScoreException {
        List<Score> scores = new ArrayList<>();
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(SELECT_SCORE)) {
                ps.setString(1, game);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        Score score = new Score(
                                rs.getString(1),
                                rs.getString(2),
                                rs.getInt(3),
                                rs.getTimestamp(4)
                        );
                        scores.add(score);
                    }
                }
            }
        } catch (SQLException e) {
            throw new ScoreException("Error loading score", e);
        }
        return scores;
    }

    public void deleteScores(Score score) throws ScoreException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_SCORE)) {
                ps.setString(1, score.getGame());
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new ScoreException("Error score", e);
        }

    }

}
