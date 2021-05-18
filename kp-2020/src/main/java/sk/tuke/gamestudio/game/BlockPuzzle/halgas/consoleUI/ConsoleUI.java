package sk.tuke.gamestudio.game.BlockPuzzle.halgas.consoleUI;


import org.springframework.beans.factory.annotation.Autowired;
import sk.tuke.gamestudio.entity.Comment;
import sk.tuke.gamestudio.entity.Rating;
import sk.tuke.gamestudio.entity.Score;
import sk.tuke.gamestudio.game.BlockPuzzle.halgas.core.*;
import sk.tuke.gamestudio.service.*;
import sk.tuke.gamestudio.service.exceptions.CommentException;
import sk.tuke.gamestudio.service.exceptions.RatingException;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ConsoleUI {
    private static final Pattern INPUT_REGEX = Pattern.compile("([M])([A-F])([0-9])");
    private static final Pattern INPUT_REGEX2 = Pattern.compile("([C])([1-6])");
    private static final String GAME_NAME = "blockpuzzle";
    private Field field;
    private Scanner scanner;
    private Puzzle current;

    @Autowired
    private ScoreService scoreService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private RatingService ratingService;
    private String name;
    private int hints;
    private int hinted;
    private int levelNumber;
    private int totalScore;


    public ConsoleUI(Field field) {
        levelNumber = 1;
        this.field = field;
        scanner = new Scanner(System.in);
        System.out.print(ConsoleColors.BLACK + ConsoleColors.RED_BACKGROUND + " Enter your name: " + ConsoleColors.RESET + " ");
        name = scanner.nextLine();
        System.out.println(ConsoleColors.RESET);
    }

    public void play() {
        info();
        changeLevel(levelNumber, 0);
    }

    public void changeLevel(int levelNumber, int score) {
        totalScore = totalScore + score;
        System.out.println(ConsoleColors.GREEN + "Your total score is " + totalScore + ConsoleColors.RESET);
        LevelGenerator levelGenerator = new LevelGenerator(levelNumber);
        field = new Field(levelGenerator.generateRowCount(), levelGenerator.generateColCount());

        if (field.getRowCount() <= 4) {
            hints = 1;
        } else hints = 2;
        hinted = 0;
        gameLoop();
    }


    private void gameLoop() {
        levelLoop();
        levelNumber++;

        if (levelNumber > 10) {
            totalScore = +totalScore + field.getScore();
            System.out.println(ConsoleColors.BLACK + ConsoleColors.GREEN_BACKGROUND + " Game solved! " + ConsoleColors.RESET + " ");
            runComponents();
        } else {
            changeLevel(levelNumber, field.getScore());
        }
    }

    private void levelLoop() {
        System.out.println(ConsoleColors.BLACK + ConsoleColors.GREEN_BACKGROUND + " Playing level " + levelNumber + " " + ConsoleColors.RESET + " ");
        System.out.println(ConsoleColors.BLACK + ConsoleColors.RED_BACKGROUND + " Or press X to end game now " + ConsoleColors.RESET + " ");
        printAllPuzzles();
        System.out.println("-You have " + hints + " hints!");
        do {
            show();
            handleInput();
            if (field.isSolved()) {
                field.setState(GameState.SOLVED);
            }
        } while (field.getState() == GameState.PLAYING);

        System.out.println(ConsoleColors.BLACK + ConsoleColors.GREEN_BACKGROUND + " Level " + levelNumber + " solved! " + ConsoleColors.RESET + " ");
        show();
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            System.err.format("IOException: %s%n", e);
        }
    }

    private void show() {
        printColumnNumbers();

        for (int row = 0; row < field.getRowCount(); row++) {
            System.out.print((char) ('A' + row));
            System.out.print(" ");
            for (int column = 0; column < field.getColumnCount(); column++) {
                Tile tile = field.getTile(row, column);
                System.out.print(" ");
                switch (tile.getState()) {
                    case FULL:
                        System.out.print("X");
                        break;
                    case FREE:
                        System.out.print("-");
                        break;
                    default:
                        throw new IllegalArgumentException("Unexpected tile state " + tile.getState());
                }
            }
            //print Puzzles state
            printPuzzleStates(row);
        }

        System.out.println();
        System.out.println(ConsoleColors.PURPLE_BOLD + "--------------".repeat(12));
        System.out.print(ConsoleColors.RESET);
    }

    private void printColumnNumbers() {
        System.out.println();
        System.out.print("   ");
        for (int column = 0; column < field.getColumnCount(); column++) {
            System.out.print(column);
            System.out.print(" ");
        }
        System.out.println();
    }

    private void printPuzzleStates(int row) {
        switch (field.getPuzzles().get(row).getState()) {
            case WAITING:
                System.out.println("     puzzle " + (row + 1) + " waiting");
                break;
            case PLACED:
                System.out.println("     puzzle " + (row + 1) + " placed");
                break;
            case CHOSEN:
                System.out.println("     puzzle " + (row + 1) + " chosen");
                break;
            default:
                throw new IllegalArgumentException("Unexpected puzzle state " + field.getPuzzles().get(row).getState());
        }
    }


    private void handleInput() {
        System.out.print(ConsoleColors.BLACK + ConsoleColors.RED_BACKGROUND + " Please enter command: " + ConsoleColors.RESET + " ");
        String line = scanner.nextLine().toUpperCase();

        //exit game
        if ("X".equals(line)) {
            runComponents();
            field.resetScore();
            System.exit(0);
        }

        Matcher matcher = INPUT_REGEX.matcher(line);
        Matcher matcher2 = INPUT_REGEX2.matcher(line);

        //choose puzzle
        if (matcher2.matches()) {
            int index = Integer.parseInt(matcher2.group(2)) - 1;
            tryToChoosePuzzle(index);
        }

        //place puzzle
        else if (matcher.matches()) {
            int row = matcher.group(2).charAt(0) - 'A';
            int column = Integer.parseInt(matcher.group(3));
            tryToMovePuzzle(row, column);
        } else if ("I".equals(line)) {
            info();
        } else if ("S".equals(line)) {
            solution();
        } else if ("H".equals(line)) {
            if (hints > 0) {
                field.hint(hinted);
                hinted++;
                hints--;
            }
            System.out.println("-You used hint! You have " + hints + " hints!");
        }

        //wrong input
        else {
            System.out.println("Wrong input!");
        }
    }

    private void tryToChoosePuzzle(int index) {
        current = field.getPuzzles().get(index);
        if (current.getState() == PuzzleState.CHOSEN) System.out.println("Already chosen!");
        else {
            current.choosePuzzle(field);
            System.out.println("puzzle " + current.getOrder() + " chosen");
            //vypis novej Puzzle
            drawPuzzle(current);
        }
    }

    //vykresli puzzle v prislusnej farbe
    private void drawPuzzle(Puzzle puzzle) {
        System.out.println("puzzle " + puzzle.getOrder());
        for (int row = 0; row < puzzle.getNewRowCount(); row++) {
            for (int j = 0; j < puzzle.getNewColCount(); j++) {
                if (puzzle.getFinalPuzzle().get(row).contains(j)) {
                    puzzleSwitch(puzzle);
                    System.out.print("X");
                    System.out.print(ConsoleColors.RESET);

                } else {
                    System.out.print(" ");
                }
            }
            System.out.println();
        }
    }

    private void puzzleSwitch(Puzzle puzzle) {
        switch (puzzle.getOrder()) {
            case 1:
                System.out.print(ConsoleColors.RED);
                break;
            case 2:
                System.out.print(ConsoleColors.BLUE);
                break;
            case 3:
                System.out.print(ConsoleColors.GREEN);
                break;
            case 4:
                System.out.print(ConsoleColors.PURPLE);
                break;
            case 5:
                System.out.print(ConsoleColors.CYAN);
                break;

            default:
                System.out.print(ConsoleColors.WHITE);
        }
    }

    private void tryToMovePuzzle(int row, int column) {
        if (current == null) {
            System.out.println("nothing chosen");
        } else {
            if (current.getState() == PuzzleState.PLACED) {
                System.out.println("Already placed, choose again");
            } else {
                if (current.movePuzzle(field, row, column)) {
                    System.out.println(ConsoleColors.GREEN + "Puzzle placed");
                    System.out.print(ConsoleColors.RESET);
                } else {
                    System.out.println(ConsoleColors.RED + "Position taken, you cant move it!");
                    System.out.println(ConsoleColors.RESET);
                }
            }
        }
    }

    private void info() {
        System.out.print(ConsoleColors.BLACK + ConsoleColors.GREEN_BACKGROUND + " INFO: " + ConsoleColors.RESET + "   Welcome " + name + "!");
        System.out.println();
        System.out.println("-This game has 10 levels!");
        System.out.println("-Press X to exit game!");
        System.out.println("-Press S to show solution, your score will be 0!");
        System.out.println("-Press H to use hint!");
        System.out.println("-Press I to show info!");
        System.out.println("-Press C and NUMBER of puzzle you want to choose (example: C2)");
        System.out.println("-Press M, LETTER (representing row) and NUBMER (representing column) if you want to place chosen puzzle on postion (example: MA0)");
        System.out.println(ConsoleColors.PURPLE_BOLD + "--------------".repeat(12));
        System.out.print(ConsoleColors.RESET);
    }

    private void printAllPuzzles() {
        for (int i = 0; i < field.getPuzzles().size(); i++) {
            drawPuzzle(field.getPuzzles().get(i));
        }
        System.out.println(ConsoleColors.PURPLE_BOLD + "--------------".repeat(12));
        System.out.print(ConsoleColors.RESET);
    }

    private void solution() {
        System.out.println();
        System.out.println("SOLUTION");
        printSolution();
        field.resetScore();
        System.out.print(ConsoleColors.RESET);
        System.out.println("You used solution, your score is 0!");
    }

    private void printSolution() {
        for (int row = 0; row < field.getRowCount(); row++) {
            for (int col = 0; col < field.getColumnCount(); col++) {
                if (field.getPuzzleTile(row, col) == 0)
                    System.out.print(ConsoleColors.RED + (field.getPuzzleTile(row, col) + 1));
                else if (field.getPuzzleTile(row, col) == 1)
                    System.out.print(ConsoleColors.BLUE + (field.getPuzzleTile(row, col) + 1));
                else if (field.getPuzzleTile(row, col) == 2)
                    System.out.print(ConsoleColors.GREEN + (field.getPuzzleTile(row, col) + 1));
                else if (field.getPuzzleTile(row, col) == 3)
                    System.out.print(ConsoleColors.PURPLE + (field.getPuzzleTile(row, col) + 1));
                else if (field.getPuzzleTile(row, col) == 4)
                    System.out.print(ConsoleColors.CYAN + (field.getPuzzleTile(row, col) + 1));
                else if (field.getPuzzleTile(row, col) == 5)
                    System.out.print(ConsoleColors.WHITE + (field.getPuzzleTile(row, col) + 1));
                else {
                    System.out.print("X");
                }
                System.out.print(" ");
            }
            System.out.println(ConsoleColors.RESET);
        }
    }


    private void runComponents() {
        //skore
        runScores();
        printScores();

        //komentare
        runComments();
        printComments();

        //rating
        runRatings();
        printRatings();
    }

    private void runScores() {
        scoreService.addScore(new Score(GAME_NAME, name, totalScore, new Date()));
        System.out.println(ConsoleColors.BLACK + ConsoleColors.GREEN_BACKGROUND + " Your score: " + totalScore + " " + ConsoleColors.RESET);
    }

    private void printScores() {
        List<Score> scores = scoreService.getBestScores(GAME_NAME);
        Collections.sort(scores, Collections.reverseOrder());

        System.out.print(ConsoleColors.BLACK + ConsoleColors.GREEN_BACKGROUND + "Top scores: ");
        System.out.print(ConsoleColors.RESET + " ");
        System.out.println();
        for (Score s : scores) {
            System.out.println(s.getText());
        }
        System.out.println();
    }

    private void runComments() {
        System.out.print(ConsoleColors.BLACK + ConsoleColors.RED_BACKGROUND + " Write comment: ");
        System.out.print(ConsoleColors.RESET + " ");
        String comment = scanner.nextLine();
        try {
            commentService.addComment(new Comment(name, GAME_NAME, comment, new Date()));
        } catch (CommentException e) {
            e.printStackTrace();
        }
    }

    private void printComments() {
        List<Comment> comments;
        System.out.print(ConsoleColors.BLACK + ConsoleColors.GREEN_BACKGROUND + " Posledne komentare: ");
        System.out.print(ConsoleColors.RESET + " ");
        System.out.println();
        try {
            comments = commentService.getComments(GAME_NAME);
            if (comments.size() > 0) {
                for (int i = comments.size() - 1; i > 0; i--) {
                    System.out.println(comments.get(i).getText());
                }
            }
        } catch (CommentException e) {
            e.printStackTrace();
        }
        System.out.println();
    }

    private void runRatings() {
        runAvgRating();
        runUserRating();
    }

    private void runAvgRating() {
        System.out.print(ConsoleColors.BLACK + ConsoleColors.GREEN_BACKGROUND + " Priemerne hodnotenie: ");
        System.out.print(ConsoleColors.RESET + " ");

        int rating;
        try {
            rating = ratingService.getAverageRating(GAME_NAME);
            System.out.println(ConsoleColors.YELLOW_BRIGHT + toStars(rating));
        } catch (RatingException e) {
            e.printStackTrace();
        }

        System.out.println();
    }

    private void runUserRating() {
        int rating = 0;
        while (rating < 1 || rating > 5) {
            System.out.print(ConsoleColors.BLACK + ConsoleColors.RED_BACKGROUND + " Ohodnot hru v rozmedzi 1-5: ");
            System.out.print(ConsoleColors.RESET + " ");
            try {
                rating = scanner.nextInt();
            } catch (InputMismatchException e) {
                System.out.println("Nezadal si cislo! Rating ulozeny ako 5/5 ");
                rating = 5;
            }

            System.out.print(ConsoleColors.RESET);
            if (rating < 1 || rating > 5) {
                System.out.println("Zle zadane hodnotenie, zadaj cislo od 1 po 5");
            }
        }
        try {
            ratingService.setRating(new Rating(name, GAME_NAME, rating, new Date()));
        } catch (RatingException e) {
            e.printStackTrace();
        }
    }

    private void printRatings() {
        int rating;
        System.out.print(ConsoleColors.BLACK + ConsoleColors.GREEN_BACKGROUND + " Tvoje hodnotenie: ");
        System.out.print(ConsoleColors.RESET + " ");
        try {
            rating = ratingService.getRating(GAME_NAME, name);
            System.out.println(ConsoleColors.YELLOW_BRIGHT + toStars(rating));
            System.out.print(ConsoleColors.RESET);

        } catch (RatingException e) {
            e.printStackTrace();
        }
    }

    private String toStars(int rating) {
        if (rating == 0) return "Neuvedene";
        if (rating == 1) return "*";
        if (rating == 2) return "**";
        if (rating == 3) return "***";
        if (rating == 4) return "****";
        return "*****";
    }

}
