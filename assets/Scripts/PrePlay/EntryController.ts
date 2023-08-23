import { _decorator, Button, Component, director, Node } from 'cc';
import { Data, SCENE_NAME } from '../Data';
const { ccclass, property } = _decorator;

@ccclass('EntryController')
export class EntryController extends Component {
    @property({ type: Button})
    private playBtn: Button;

    protected start(): void {
        try {
            if(!localStorage.getItem(Data.highscore)) {
                localStorage.setItem(Data.highscore, '0')
            } 
        } catch (error) {
            if ( Data.highScoreStatic === null ) Data.highScoreStatic = 0;
        }
    }

    private onClickBtnPlay(): void {
        director.loadScene(SCENE_NAME.Play)
    }
}

