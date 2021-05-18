package sk.tuke.gamestudio.service.jdbc;

import sk.tuke.gamestudio.entity.Rating;
import sk.tuke.gamestudio.service.RatingService;
import sk.tuke.gamestudio.service.exceptions.RatingException;
import sk.tuke.gamestudio.service.exceptions.ScoreException;

import java.sql.*;


public class RatingServiceJDBC implements RatingService, ServiceInfo {

    private static final String DELETE_RATING =
            "DELETE FROM rating WHERE player =?";

    private static final String INSERT_RATING =
            "INSERT INTO rating ( player, game, rating, ratedon, ident) VALUES (?, ?, ?, ?, ?)";

    private static final String SELECT_RATING =
            "SELECT rating FROM rating WHERE game  = ? AND player = ?";

    private static final String AVG_RATING =
            "SELECT AVG(rating) FROM rating WHERE game  = ?";

    private static final String DELETE_RATINGS =
            "DELETE FROM rating WHERE game =?";



    @Override
    public void setRating(Rating rating) throws RatingException {
        deleteRating(rating);
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(INSERT_RATING)) {
                ps.setString(1, rating.getPlayer());
                ps.setString(2, rating.getGame());
                ps.setInt(3, rating.getRating());
                ps.setDate(4, new Date(rating.getRatedon().getTime()));
                ps.setInt(5, rating.getIdent());

                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new RatingException("Error rating score", e);
        }
    }

    @Override
    public int getAverageRating(String game) throws RatingException {
        int average = 0;
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(AVG_RATING)) {
                ps.setString(1, game);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        average = rs.getInt(1);
                    }
                }
            }
        } catch (SQLException e) {
            throw new RatingException("Error loading rating", e);
        }

        return average;
    }

    @Override
    public int getRating(String game, String player) throws RatingException {
        int rating = 0;
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(SELECT_RATING)) {
                ps.setString(1, game);
                ps.setString(2, player);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        rating = rs.getInt(1);
                    }
                }
            }
        } catch (SQLException e) {
            throw new RatingException("Error loading rating", e);
        }

        return rating;
    }

    public void deleteRatings(Rating rating) throws RatingException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_RATINGS)) {
                ps.setString(1, rating.getGame());
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new ScoreException("Error rating", e);
        }

    }

    private void deleteRating(Rating rating) throws RatingException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_RATING)) {
                ps.setString(1, rating.getPlayer());
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new RatingException("Error rating score", e);
        }

    }
}



