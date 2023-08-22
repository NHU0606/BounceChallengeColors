import { _decorator, Button, Component, director, Node } from 'cc';
import { SCENE_NAME } from './Data';
const { ccclass, property } = _decorator;

@ccclass('EntryController')
export class EntryController extends Component {
    @property({ type: Button})
    private playBtn: Button;

    private onClickBtnPlay(): void {
        director.loadScene(SCENE_NAME.Play)
    }
}

