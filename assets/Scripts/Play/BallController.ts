import { AudioController } from "../AudioController";
import { AudioType } from "../Data/Constants";
import { Score } from '../Score';
import { _decorator, Component, EventTouch, input, Input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BallController')
export class BallController extends Component {
    @property({ type: AudioController })
    private audioControl: AudioController;

    private speed: Vec3 = new Vec3(0, 0, 0); 
    private jump: boolean = false;
    private right: boolean = false;

    @property({ type: Score})
    private score: Score;

    public get Right() : boolean {
        return this.right;
    }
    
    protected onLoad(): void {
        this.score.node.active = false;
        this.speed.x = 3; 
        this.node.position = new Vec3(0, 50, 0);
        setTimeout(() => {
            input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            this.score.node.active = true;
        }, 3500)
    }

    private onTouchStart(event: EventTouch): void {
        this.speed.y = 5; 
        this.jump = true;
        this.audioControl.playSound(AudioType.ClickJump);
    }

    protected update(dt: number): void {
        if (this.jump) {
            this.speed.y -= 0.2; 
            this.node.position = this.node.position.add(this.speed);
        }
    }

    public touchLeftWall(): void {
        this.score.addScore();
        this.right = false;
        this.speed.x = 3;

        this.node.position = this.node.position.add(this.speed);

    }

    public touchRightWall(): void {
        this.score.addScore();
        this.right = true;
        this.speed.x = -3;

        this.node.position = this.node.position.add(this.speed);
    }
}
