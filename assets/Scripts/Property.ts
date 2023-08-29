import { _decorator, AnimationClip, Button, Component, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { BallController } from './Play/BallController';
import { PauseController } from './Play/PauseController';
const { ccclass, property } = _decorator;

@ccclass('Property')
export class Property extends Component {
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

    @property({ type: Prefab })
    private starPoint: Prefab;

    public get StarPoint(): Prefab {
        return this.starPoint;
    }

    @property({ type: Node })
    private starPointContain: Node;

    
    public get StarPointContain() : Node {
        return this.starPointContain;
    }

    @property({ type: Prefab })
    private boomPrefab: Prefab;

    public get BoomPrefab(): Prefab {
        return this.boomPrefab;
    }

    @property({ type: Node })
    private boomContain: Node;

    
    public get BoomContain() : Node {
        return this.boomContain;
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
    private leftLine: Node;

    public get LeftLine() : Node {
        return this.leftLine;
    }

    @property({ type: Node })
    private rightLine: Node;

    
    public get RightLine() : Node {
        return this.rightLine;
    }

    @property({ type: Node })
    private leftFakeLine: Node;

    public get LeftFakeLine() : Node {
        return this.leftFakeLine;
    }

    @property({ type: Node })
    private rightFakeLine: Node;

    
    public get RightFakeLine() : Node {
        return this.rightFakeLine;
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

    @property({ type: Node })
    private topInfoContain: Node;

    
    public get TopInfoContain() : Node {
        return this.topInfoContain;
    }

    @property({ type: Node })
    private pauseContain: Node;

    
    public get PauseContain() : Node {
        return this.pauseContain;
    }

    @property({ type: Node })
    private pauseInfo: Node;

    
    public get PauseInfo() : Node {
        return this.pauseInfo;
    }

    @property({ type: Button })
    private pauseBtn: Button;

    
    public get PauseBtn() : Button {
        return this.pauseBtn;
    }

    @property({ type: Node })
    private heartInfo: Node;
    
    public get HeartInfo() : Node {
        return this.heartInfo;
    }

    @property({ type: Node })
    private animContain: Node;
    
    public get AnimContain() : Node {
        return this.animContain;
    }

    @property({ type: Node })
    private animTouchStar: Node;
    
    public get AnimTouchStar() : Node {
        return this.animTouchStar;
    }

    @property({ type: Node })
    private nontifiOver: Node;
    
    public get NontifiOver() : Node {
        return this.nontifiOver;
    }

    @property({ type: Node })
    private nontifiWin: Node;
    
    public get NontifiWin() : Node {
        return this.nontifiWin;
    }

    @property({ type: Prefab })
    private boomColorPrefab: Prefab;

    public get BoomColorPrefab(): Prefab {
        return this.boomColorPrefab;
    }

    @property({ type: Node })
    private boomColorContain: Node;
    
    public get BoomColorContain() : Node {
        return this.boomColorContain;
    }

    @property({ type: Node })
    private containImgSoundContain: Node;
    
    public get ContainImgSoundContain() : Node {
        return this.containImgSoundContain;
    }

    @property({ type: Sprite })
    private ballSprite: Sprite;
    
    public get BallSprite() : Sprite {
        return this.ballSprite;
    }

    @property({ type: [SpriteFrame] })
    private ballSpriteFrame: SpriteFrame[] = [];

    public get BallSpriteFrame(): SpriteFrame[] {
        return this.ballSpriteFrame;
    }

    // pause btn
    @property({ type: Button })
    private homeBtn: Button;

    public get HomeBtn() : Button {
        return this.homeBtn;
    }

    @property({ type: Button })
    private replayBtn: Button;

    
    public get ReplayBtn() : Button {
        return this.replayBtn;
    }

    @property({ type: Button })
    private continueBtn: Button;
    
    public get ContinueBtn() : Button {
        return this.continueBtn;
    }
    
    @property({ type: Button })
    private shopBtn: Button;
    
    public get ShopBtn() : Button {
        return this.shopBtn;
    }
}

