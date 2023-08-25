import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Data')
export class Data extends Component {
    public static readonly highscore = 'highscoreBounceChallenge';
    public static readonly sound = 'soundBounceChanllenge';
    
    public static highScoreStatic: number = 0;
    public static soundStatic: number = 1;
}

export const SCENE_NAME = {
    Entry: 'Entry',
    Play: 'Play',
    Shop: 'Shop'
}
