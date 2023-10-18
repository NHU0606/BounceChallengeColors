import { _decorator, Component, director, Node, Skeleton, sp } from 'cc';
import Constants from '../Data/Constants';
const { ccclass, property } = _decorator;

@ccclass('LogoManager')
export class LogoManager extends Component {
    @property({ type: Node })
    private logoAnim: Node = null;

    protected start(): void {
        let anim = this.logoAnim.getComponent(sp.Skeleton);
        anim.setCompleteListener(this.gotAnim);
    }

    private gotAnim(track): void {
        if ( track.animation.name === 'Option 1') {
            director.loadScene(Constants.SCENE_NAME.Loading)
        }
    }
}


