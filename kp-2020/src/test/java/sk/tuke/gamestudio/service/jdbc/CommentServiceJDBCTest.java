package sk.tuke.gamestudio.service.jdbc;


import org.junit.jupiter.api.Test;
import sk.tuke.gamestudio.entity.Comment;
import sk.tuke.gamestudio.service.exceptions.CommentException;
import sk.tuke.gamestudio.service.jdbc.CommentServiceJDBC;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class CommentServiceJDBCTest {

    private CommentServiceJDBC service = new CommentServiceJDBC();

    @Test
    public void testEmptyDatabase() throws CommentException {
        service.deleteComments(new Comment("fere", "blockpuzzle", "parada", new Date()));
        assertEquals(0, service.getComments("blockpuzzle").size());
    }


    @Test
    public void addComment() throws CommentException {
        service.deleteComments(new Comment("fere", "blockpuzzle", "parada", new Date()));
        Comment comment = new Comment("paly", "blockpuzzle", "ujde", new Date());
        comment.setIdent(1);
        System.out.println(comment.getIdent());
        service.addComment(comment);
        assertEquals(1, service.getComments("blockpuzzle").size());
        service.deleteComments(new Comment("fere", "blockpuzzle", "parada", new Date()));
    }

    @Test
    public void testGetComments() throws CommentException {
        service.deleteComments(new Comment("fere", "blockpuzzle", "parada", new Date()));
        Comment comment = new Comment("rudo", "blockpuzzle", "ujde hra", new Date());
        Comment comment1 = new Comment("filipo", "blockpuzzle", "parada hra", new Date());
        comment.setIdent(1);
        comment1.setIdent(2);
        service.addComment(comment);
        service.addComment(comment1);

        List<Comment> comments = service.getComments("blockpuzzle");
        assertEquals(comment.getComment(), comments.get(0).getComment());
        assertEquals(comment.getPlayer(), comments.get(0).getPlayer());
        service.deleteComments(new Comment("fere", "blockpuzzle", "parada", new Date()));
    }

}
