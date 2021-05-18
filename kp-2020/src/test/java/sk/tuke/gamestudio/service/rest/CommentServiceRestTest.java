package sk.tuke.gamestudio.service.rest;

import org.junit.jupiter.api.Test;
import sk.tuke.gamestudio.entity.Comment;
import sk.tuke.gamestudio.service.CommentService;
import sk.tuke.gamestudio.service.exceptions.CommentException;
import sk.tuke.gamestudio.service.jdbc.ServiceInfo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CommentServiceRestTest implements ServiceInfo {
    private static final String DELETE_COMMENTS =
            "DELETE FROM comment WHERE game = 'blockpuzzle'";
    private CommentService service = new CommentServiceRestClient();

    @Test
    public void testEmptyDatabase() throws CommentException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_COMMENTS)) {
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new CommentException("Error saving comment", e);
        }

        assertEquals(0, service.getComments("blockpuzzle").size());
    }


    @Test
    public void addComment() throws CommentException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_COMMENTS)) {
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new CommentException("Error saving comment", e);
        }

        Comment comment = new Comment("paly", "blockpuzzle", "ujde", new Date());
        service.addComment(comment);
        assertEquals(1, service.getComments("blockpuzzle").size());

    }

    @Test
    public void testGetComments() throws CommentException {
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            try (PreparedStatement ps = connection.prepareStatement(DELETE_COMMENTS)) {
                ps.executeUpdate();
            }
        } catch (SQLException e) {
            throw new CommentException("Error saving comment", e);
        }

        Comment comment = new Comment("rudo", "blockpuzzle", "ujde hra", new Date());
        Comment comment1 = new Comment("filipo", "blockpuzzle", "parada hra", new Date());
        service.addComment(comment);
        service.addComment(comment1);

        List<Comment> comments = service.getComments("blockpuzzle");
        assertEquals(comment.getComment(), comments.get(0).getComment());
        assertEquals(comment.getPlayer(), comments.get(0).getPlayer());
    }

}
