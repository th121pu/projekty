package sk.tuke.gamestudio.service.jpa;

import sk.tuke.gamestudio.entity.Rating;
import sk.tuke.gamestudio.service.exceptions.RatingException;
import sk.tuke.gamestudio.service.RatingService;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

@Transactional
public class RatingServiceJPA implements RatingService {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void setRating(Rating rating) throws RatingException {
        Rating replace;
        try {
            replace = (Rating) entityManager.createNamedQuery("Rating.getRating")
                    .setParameter("game", rating.getGame()).setParameter("player", rating.getPlayer()).getSingleResult();

            replace.setRating(rating.getRating());
        } catch (NoResultException e) {
            entityManager.persist(rating);
        }
    }

    @Override
    public int getAverageRating(String game) throws RatingException {
        try {
            double avg = (double) entityManager.createNamedQuery("Rating.getAverageRating")
                    .setParameter("game", game).getSingleResult();
            return (int) Math.round(avg);
        } catch (NullPointerException e) {
            System.out.println("ziadne hodnotenie");
        }
        return 0;
    }

    @Override
    public int getRating(String game, String player) throws RatingException {
        try {
            Rating rating = (Rating) entityManager.createNamedQuery("Rating.getRating")
                    .setParameter("game", game).setParameter("player", player).getSingleResult();
            return rating.getRating();
        } catch (NoResultException e) {
            System.out.println("ziadne hodnotenie");
        }
        return 0;
    }
}
