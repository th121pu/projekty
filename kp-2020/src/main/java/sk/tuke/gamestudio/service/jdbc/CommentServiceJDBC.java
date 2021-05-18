package sk.tuke.gamestudio.service.jdbc;

import sk.tuke.gamestudio.entity.Comment;
import sk.tuke.gamestudio.service.CommentService;
import sk.tuke.gamestudio.service.exceptions.CommentException;
import sk.tuke.gamestudio.service.exceptions.ScoreException;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;


public class CommentServiceJDBC implements CommentService, ServiceInfo {

    private static final String INSERT_COMMENT =
            "INSERT INTO comment (player, game, comment, commented_on, ident) VALUES (?, ?, ?, ?, ?)";

    private static final String SELECT_COMMENT =
            "SELECT player, game, comment, commented_on FROM comment WHERE game  = ?";

    private static final String DELETE_COMMENT =
            "DELETE FROM comment WHERE game =?";


    @Override
    public void addComment(Comment comment) throws CommentException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(INSERT_COMMENT)) {
                ps.setString(1, comment.getPlayer());
                ps.setString(2, comment.getGame());
                ps.setString(3, comment.getComment());
                ps.setDate(4, new Date(comment.getCommentedOn().getTime()));
                ps.setInt(5, comment.getIdent());

                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new CommentException("Error saving comment", e);
        }
    }

    @Override
    public List<Comment> getComments(String game) throws CommentException {
        List<Comment> comments = new ArrayList<>();
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(SELECT_COMMENT)) {
                ps.setString(1, game);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        Comment comment = new Comment(
                                rs.getString(1),
                                rs.getString(2),
                                rs.getString(3),
                                rs.getTimestamp(4)
                        );
                        comments.add(comment);
                    }
                }
            }
        } catch (SQLException e) {
            throw new CommentException("Error loading comment", e);
        }
        return comments;
    }

    public void deleteComments(Comment comment) throws CommentException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_COMMENT)) {
                ps.setString(1, comment.getGame());
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new ScoreException("Error comment", e);
        }

    }


}
