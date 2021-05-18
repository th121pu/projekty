package sk.tuke.gamestudio.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import java.io.Serializable;
import java.util.Date;

@Entity
@NamedQuery(name = "Comment.getComments",
        query = "SELECT c FROM Comment c WHERE c.game=:game")
public class Comment implements Comparable<Comment>, Serializable {
    @Id
    @GeneratedValue
    private int ident; //identifikator
    private String player;
    private String game;
    private String comment;
    private Date commentedOn;

    public Comment() {
    }

    public Comment(String player, String game, String comment, Date commentedon) {
        this.player = player;
        this.game = game;
        this.comment = comment;
        this.commentedOn = commentedon;
    }

    public int getIdent() {
        return ident;
    }

    public void setIdent(int ident) {
        this.ident = ident;
    }

    public String getText() {
        return player + ": " + comment;
    }

    public String getPlayer() {
        return player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }

    public String getGame() {
        return game;
    }

    public void setGame(String game) {
        this.game = game;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getCommentedOn() {
        return commentedOn;
    }

    public void setCommentedOn(Date commentedOn) {
        this.commentedOn = commentedOn;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Comment{");
        sb.append("ident='").append(ident).append('\'');
        sb.append("player='").append(player).append('\'');
        sb.append(", game='").append(game).append('\'');
        sb.append(", comment=").append(comment);
        sb.append(", commentedon=").append(commentedOn);
        sb.append('}');
        return sb.toString();
    }

    @Override
    public int compareTo(Comment o) {
        if (o == null) return -1;
        return 0;
    }
}
