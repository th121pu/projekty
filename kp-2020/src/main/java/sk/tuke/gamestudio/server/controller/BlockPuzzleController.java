package sk.tuke.gamestudio.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.WebApplicationContext;
import sk.tuke.gamestudio.entity.Comment;
import sk.tuke.gamestudio.entity.Rating;
import sk.tuke.gamestudio.entity.Score;
import sk.tuke.gamestudio.game.BlockPuzzle.halgas.core.*;
import sk.tuke.gamestudio.service.CommentService;
import sk.tuke.gamestudio.service.RatingService;
import sk.tuke.gamestudio.service.ScoreService;
import sk.tuke.gamestudio.service.exceptions.CommentException;


import java.util.Date;


@Controller
@Scope(WebApplicationContext.SCOPE_SESSION)
@RequestMapping("/blockpuzzle-halgas")
public class BlockPuzzleController {
    @Autowired
    private ScoreService scoreService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private RatingService ratingService;
    @Autowired
    private UserController userController;
    private Field field;
    private boolean chosen;
    private boolean solution;
    private boolean gameEnded;
    private Puzzle current;

    private int totalScore;
    private int hints;
    private int hinted;
    private int levelNumber;
    private int diffLevel;

    private String playerName;
    private String gameName = "blockpuzzle";

    @RequestMapping
    public String blockpuzzle(String rowOrIndex, String column, Model model) {
        if (field == null) newGame();
        try {
            if (!chosen) {
                if (column == null) tryToChoosePuzzle(rowOrIndex);
            } else {
                if (field.getState() == GameState.PLAYING) {
                    if (column == null) tryToChoosePuzzle(rowOrIndex);

                    else {
                        current.movePuzzle(field, Integer.parseInt(rowOrIndex), Integer.parseInt(column));
                        chosen = false;
                        current = null;
                    }
                }
            }

        } catch (NumberFormatException e) {
            e.printStackTrace();
        }

        prepareModels(model);
        return "blockpuzzle-halgas";
    }

    @RequestMapping("/new")
    public String newGame(String difficulty, Model model) {
        diffLevel = Integer.parseInt(difficulty);
        playerName = userController.getLoggedUser();
        newGame();
        prepareModels(model);
        return "blockpuzzle-halgas";
    }

    private void prepareModels(Model model) {
        model.addAttribute("scores", scoreService.getBestScores(gameName));
        model.addAttribute("comments", commentService.getComments(gameName));
        model.addAttribute("rating", getAverageRating());
        model.addAttribute("playerRating", getPlayerRating());


        if (levelNumber <= 10) model.addAttribute("levelNumber", getLevelNumber());
        else model.addAttribute("levelNumber", "GAME FINISHED");

        if (isLevelWon() && levelNumber <= 10) model.addAttribute("nextOne", nextLevelInfo());
        else if (isLevelWon() && userController.isLogged())
            model.addAttribute("nextOne", "Game won! Your total score " + totalScore + " was saved.");

        if (solution) model.addAttribute("solutionOrCurrent", getSolution());
        else model.addAttribute("solutionOrCurrent", getCurrentHtmlPuzzle());

    }


    private String nextLevelInfo() {
        StringBuilder sb = new StringBuilder();
        sb.append("<a class='level' href='/blockpuzzle-halgas/nextLevel'>\n");
        sb.append("<button class='options'>\n");
        sb.append("Next Level");
        sb.append("</button></a>");
        return sb.toString();
    }

    private void newGame() {
        current = null;
        gameEnded = false;
        levelNumber = 1;
        totalScore = 0;
        play();
    }

    private void play() {
        changeLevel(levelNumber, 0);
    }

    public void changeLevel(int levelNumber, int score) {
        if (diffLevel == 1) totalScore = totalScore + score;
        else if (diffLevel == 2)  totalScore = (int) Math.round(totalScore + score  * 1.20);
        else totalScore = (int) Math.round(totalScore + score * 1.40);

        boolean levelWon = false;
        LevelGenerator levelGenerator = new LevelGenerator(levelNumber);
        field = new Field(levelGenerator.generateRowCount(), levelGenerator.generateColCount());

        hintNumber();
        hinted = 0;
        chosen = false;
        solution = false;
        current = null;
    }

    private void hintNumber() {
        if (diffLevel == 3) hints = 0;

        else if (diffLevel == 2) {
            if (field.getRowCount() == 6) {
                hints = 1;
            }
            else hints = 0;
        }

        else {
            if (field.getRowCount() <= 4) {
                hints = 1;
            } else hints = 2;
        }
    }

    private void tryToChoosePuzzle(String index) {
        current = field.getPuzzles().get(Integer.parseInt(index));
        solution = false;
        current.choosePuzzle(field);
        chosen = true;
    }

    public boolean isChosen() {
        return chosen;
    }

    public int getLevelNumber() {
        return levelNumber;
    }

    public int getHints() {
        return hints;
    }

    public int getTotalScore() {
        return totalScore;
    }

    private boolean isChoosing() {
        return chosen;
    }

    public boolean isLevelWon() {
        return field.isSolved();
    }

    public Field getField() {
        return field;
    }

    @RequestMapping("/nextLevel")
    public String nextLevel(Model model) {
        if (!gameEnded) {
            if (isLevelWon()) {
                levelNumber++;
                if (levelNumber > 10) {
                    totalScore = totalScore + field.getScore();
                    if (userController.isLogged())   scoreService.addScore(new Score(gameName, playerName, totalScore, new Date()));
                    else model.addAttribute("scoreError", "You have to login to save your score!");
                    gameEnded = true;
                } else {
                    changeLevel(levelNumber, field.getScore());
                    prepareModels(model);
                    return "blockpuzzle-halgas";
                }
            }
        }

        prepareModels(model);
        return "blockpuzzle-halgas";
    }

    @RequestMapping("/resetField")
    public String resetField(Model model) {
        field.resetField();
        current = null;
        prepareModels(model);
        return "blockpuzzle-halgas";
    }

    @RequestMapping("/hint")
    public String hint(Model model) {
        if (hints > 0) {
            field.hint(hinted);
            current = null;
            hinted++;
            hints--;
        }
        prepareModels(model);
        return "blockpuzzle-halgas";
    }

    @RequestMapping("/solution")
    public String solution(Model model) {
        solution = true;
        field.resetScore();
        if (current != null) current.setState(PuzzleState.WAITING);
        prepareModels(model);
        return "blockpuzzle-halgas";
    }

    private String getSolution() {
        StringBuilder sb = new StringBuilder();
        sb.append("<table class='puzzle'>\n");
        for (int row = 0; row < field.getRowCount(); row++) {
            sb.append("<tr>\n");
            for (int column = 0; column < field.getColumnCount(); column++) {
                sb.append("<td>\n");
                if (field.equals(this.getField()))
                    sb.append("<div class='solutionTile ");
                sb.append(getPuzzleClass(field.getPuzzleTile(row, column)));
                sb.append("</div>\n");

                if (field.equals(this.field))
                    sb.append("</td>\n");
            }
            sb.append("</tr>\n");
        }
        sb.append("</table>\n");

        return sb.toString();
    }

    @RequestMapping("/exit")
    public String exitGame(Model model) {
        if (userController.isLogged()) scoreService.addScore(new Score(gameName, playerName, totalScore, new Date()));
        else model.addAttribute("scoreError", "You have to login to save your score!");
        newGame();
        prepareModels(model);
        return "blockpuzzle-halgas";
    }

    @RequestMapping("/rating")
    public String rateGame(String rating, Model model) {
        int newRating = Integer.parseInt(rating);
        if (userController.isLogged()) ratingService.setRating(new Rating(playerName, gameName, newRating, new Date()));
        else model.addAttribute("rateError", "You have to login!");
        prepareModels(model);
        return "blockpuzzle-halgas";
    }

    public String getHtmlField() {
        StringBuilder sb = new StringBuilder();
        sb.append("<table class='field'>\n");
        for (int row = 0; row < field.getRowCount(); row++) {
            sb.append("<tr>\n");
            for (int column = 0; column < field.getColumnCount(); column++) {
                Tile tile = field.getTile(row, column);
                sb.append("<td>\n");
                if (field.equals(this.getField()))
                    if (tile.getState() == TileState.FREE) {
                        sb.append("<a href='" +
                                String.format("/blockpuzzle-halgas?rowOrIndex=%s&column=%s", row, column)
                                + "'>\n");
                        sb.append("<div class='emptyTile black'>\n");
                        sb.append("</div>\n");
                    } else {
                        sb.append("<a href='" +
                                String.format("/blockpuzzle-halgas?rowOrIndex=%s", field.getCurrentFieldTile(row, column))
                                + "'>\n");
                        sb.append("<div class='fullTile ");
                        sb.append(getPuzzleClass(field.getCurrentFieldTile(row, column)));
                        sb.append("</div>\n");

                    }

                if (field.equals(this.field))
                    sb.append("</a>\n");
                sb.append("</td>\n");
            }
            sb.append("</tr>\n");
        }
        sb.append("</table>\n");

        return sb.toString();
    }

    public String getHtmlPuzzles() {
        StringBuilder sb = new StringBuilder();
        sb.append("<div class = 'puzzleBox'>\n");
        for (int i = 0; i < field.getPuzzles().size(); i++) {
            if (field.getPuzzles().get(i).getState() == PuzzleState.WAITING) sb.append(getOneHtmlPuzzle(i));
        }

        sb.append("</div>\n");
        return sb.toString();
    }

    private String getCurrentHtmlPuzzle() {
        if (current != null) {
            int index = current.getOrder() - 1;
            StringBuilder sb = new StringBuilder();
            sb.append("<h4>");
            sb.append("Current puzzle");
            sb.append("</h4>\n");
            sb.append("<div class = 'currentP'>");
            sb.append(getOneHtmlPuzzle(index));
            sb.append("</div>\n");
            return sb.toString();
        }
        return "";
    }


    private String getOneHtmlPuzzle(int index) {
        StringBuilder sb = new StringBuilder();
        Puzzle puzzle = field.getPuzzles().get(index);

        sb.append("<table class='puzzle ");
        sb.append(getPuzzleClass(index));
        for (int row = 0; row < puzzle.getNewRowCount(); row++) {
            sb.append("<tr>\n");

            for (int column = 0; column < puzzle.getNewColCount(); column++) {
                if (field.equals(this.getField())) {
                    if (puzzle.getFinalPuzzle().get(row).contains(column)) {
                        sb.append("<td>\n");
                        sb.append("<a href='" + String.format("/blockpuzzle-halgas?rowOrIndex=%s", index) + "'>\n");
                        sb.append("<div class = 'puzzleTile'>\n");
                        sb.append("</div>\n");
                        sb.append("</a>\n");
                        sb.append("</td>\n");

                    } else {
                        sb.append("<td class = 'white'>\n");
                        sb.append("<img src='/images/blockpuzzle/halgas/whitespace.png'>");
                        sb.append("</td>\n");
                    }
                }
            }

            sb.append("</tr>\n");
        }

        sb.append("</table>\n");
        return sb.toString();
    }

    private String getPuzzleClass(int index) {
        switch (index) {
            case 0:
                return "red'>\n";
            case 1:
                return "blue'>\n";
            case 2:
                return "green'>\n";
            case 3:
                return "purple'>\n";
            case 4:
                return "cyan'>\n";
            default:
                return "yellow'>\n";
        }
    }

    private String getPlayerRating() {
        int userRating;
        StringBuilder sb = new StringBuilder();
        sb.append("Your game rating: ");
        userRating = ratingService.getRating(gameName, playerName);

        if (userRating == 0) sb.append("Neuvedené");
        else {
            sb.append("<span id='userRating'>");
            sb.append(userRating);
            sb.append("</span>");
            sb.append("/5");
        }
        return sb.toString();
    }

    private String getAverageRating() {
        int avg;
        StringBuilder sb = new StringBuilder();
        sb.append("Average game rating: ");
        avg = ratingService.getAverageRating(gameName);
        if (avg == 0) sb.append("Neuvedené");
        else {
            sb.append(avg);
            sb.append("/5");
        }
        return sb.toString();
    }

    @RequestMapping("/formComment")
    public String addComment(Comment comment, Model model) {
        try {
            if (userController.isLogged()) commentService.addComment(new Comment(playerName, gameName, comment.getComment(), new Date()));
            else model.addAttribute("commError", "You have to login!");
        } catch (CommentException e) {
            System.err.println(e.getMessage());
        }
        prepareModels(model);
        return "blockpuzzle-halgas";
    }


}



