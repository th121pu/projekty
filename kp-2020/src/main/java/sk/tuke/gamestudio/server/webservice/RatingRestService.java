package sk.tuke.gamestudio.server.webservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sk.tuke.gamestudio.entity.Rating;
import sk.tuke.gamestudio.service.exceptions.RatingException;
import sk.tuke.gamestudio.service.RatingService;


@RestController
@RequestMapping("/api/rating")
public class RatingRestService {
    @Autowired
    private RatingService ratingService;

    @GetMapping("/{game}")
    public int getAverageRating(@PathVariable String game) {
        return ratingService.getAverageRating(game);
    }

    @GetMapping("/{game}/{player}")
    public int getRating(@PathVariable String game, @PathVariable String player) {
        return ratingService.getRating(game, player);
    }

    @PostMapping
    public void setRating(@RequestBody Rating rating) throws RatingException {
        ratingService.setRating(rating);
    }
}
