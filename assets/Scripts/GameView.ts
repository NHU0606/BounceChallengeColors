import { _decorator, AnimationClip, Component, Node, Prefab } from 'cc';
import { BallController } from './BallController';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({ type: BallController })
    private ballControl: BallController;

    public get BallControl() : BallController {
        return this.ballControl;
    }
    
    @property({ type: Node })
    private ballNode: Node;

    public get BallNode() : Node {
        return this.ballNode;
    }

    @property({ type: Node })
    private overNode: Node;

    public get OverNode() : Node {
        return this.overNode;
    }

    @property({ type: Node })
    private gameNode: Node;

    public get GameNode() : Node {
        return this.gameNode;
    }

    @property({ type: Node })
    private gameNodeFake: Node;

    public get GameNodeFake() : Node {
        return this.gameNodeFake;
    }

    @property({ type: Prefab })
    private obstaclePrefabLeft: Prefab;

    public get ObstaclePrefabLeft(): Prefab {
        return this.obstaclePrefabLeft;
    }

    @property({ type: Prefab })
    private obstaclePrefabRight: Prefab;

    public get ObstaclePrefabRight(): Prefab {
        return this.obstaclePrefabRight;
    }

    @property({ type: Node })
    private leftContain: Node;

    
    public get LeftContain() : Node {
        return this.leftContain;
    }

    @property({ type: Node })
    private rightContain: Node;

    
    public get RightContain() : Node {
        return this.rightContain;
    }

    @property({ type: Node })
    private topContain: Node;

    
    public get TopContain() : Node {
        return this.topContain;
    }

    @property({ type: Node })
    private bottomContain: Node;

    
    public get BottomContain() : Node {
        return this.bottomContain;
    }
    
}

