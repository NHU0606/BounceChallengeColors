import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Data')
export class Data extends Component {
    public static readonly highscore = 'highscoreBounceChallenge';
    
    public static highScoreStatic: number = 0;
}

export const SCENE_NAME = {
    Entry: 'Entry',
    Play: 'Play'
}
