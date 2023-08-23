import { _decorator, Button, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PauseController')
export class PauseController extends Component {
    private isIconPause: boolean = false;
    private isPause: boolean = false;
    
    public get IsPause() : boolean {
        return this.isPause;
    }

    public set IsPause(value : boolean) {
        this.isPause = value;
    }
    
    @property({ type: Node})
    public pauseBtn: Node = null;

    @property({ type: Node})
    public pauseInfo: Node = null;

    protected onLoad(): void {
        this.pauseBtn.active = true;
        this.pauseInfo.active = false;
    }

    
}

