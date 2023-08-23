import { _decorator, Component, director, Node } from 'cc';
import { SCENE_NAME } from '../Data';
const { ccclass, property } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component {
   private onClickHome(): void {
    director.loadScene(SCENE_NAME.Entry);
   }

   private onClickReplay(): void {
    director.loadScene(SCENE_NAME.Play);
   }
}

