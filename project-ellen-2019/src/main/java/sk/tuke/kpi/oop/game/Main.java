package sk.tuke.kpi.oop.game;

import sk.tuke.kpi.gamelib.*;
import sk.tuke.kpi.oop.game.scenarios.Level;

public class Main {

    public static void main(String[] args) {
        WindowSetup windowSetup = new WindowSetup("Project Ellen", 800, 600);
        Game game = new GameApplication(windowSetup);

        //Scene escapeRoom = new World("escape-room", "maps/mapka.tmx", new EscapeRoom.Factory());
        Scene level= new World("escape-room", "maps/mapka.tmx", new Level.Factory());
        //Scene mission = new World("mission-impossible", "maps/mission-impossible.tmx", new MissionImpossible.Factory());


        Level Level = new Level();
        //EscapeRoom EscapeRoom = new EscapeRoom();
        //MissionImpossible Mission = new MissionImpossible();

        game.addScene(level);
        //game.addScene(escapeRoom);
        //game.addScene(mission);

        level.addListener(Level);
        //escapeRoom.addListener(EscapeRoom);
        //mission.addListener(Mission);

        game.getInput().onKeyPressed(Input.Key.ESCAPE, game::stop);
        game.start();


    }
}
