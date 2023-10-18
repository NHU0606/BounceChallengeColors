import { _decorator, Component, director, find, Node } from 'cc';
import { GameCenterController } from '../GameCenter/GameCenterController';
import Constants from '../Data/Constants';
const { ccclass, property } = _decorator;

@ccclass('LoadingController')
export class LoadingController extends Component {
    @property( { type: GameCenterController })
    private gameCenter: GameCenterController;

    protected start(): void {
        this.gameCenter.initGameClient(()=>{
        director.loadScene(Constants.SCENE_NAME.Entry);
        })
    }
}

