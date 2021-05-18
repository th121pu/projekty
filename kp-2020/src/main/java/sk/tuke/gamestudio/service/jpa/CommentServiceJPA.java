package sk.tuke.gamestudio.service.jpa;

import sk.tuke.gamestudio.entity.Comment;
import sk.tuke.gamestudio.service.exceptions.CommentException;
import sk.tuke.gamestudio.service.CommentService;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Transactional
public class CommentServiceJPA implements CommentService {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void addComment(Comment comment) throws CommentException {
        entityManager.persist(comment);
    }

    @Override
    public List<Comment> getComments(String game) throws CommentException {
        return entityManager.createNamedQuery("Comment.getComments")
                .setParameter("game", game).getResultList();
    }




}
