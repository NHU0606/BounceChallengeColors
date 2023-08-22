import { Score } from './Score';
import { _decorator, Component, EventTouch, input, Input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BallController')
export class BallController extends Component {
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
        this.speed.x = 1; 
        this.node.position = new Vec3(0, 50, 0);
        setTimeout(() => {
            input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            this.score.node.active = true;
        }, 3000)
    }

    private onTouchStart(event: EventTouch): void {
        this.jump = true;
        this.speed.y = 5; 
        this.changeDirection();
    }

    protected update(dt: number): void {
        if (this.jump) {
            this.speed.y -= 0.2; 
            this.node.position = this.node.position.add(this.speed);
            this.changeDirection();
        }
    }

    private changeDirection(): void {
        if (this.node.position.x >= 220) {
            this.score.addScore();
            this.right = true;
            this.speed.x = -1;
        } else if (this.node.position.x <= -220) {
            this.score.addScore();
            this.right = false;
            this.speed.x = 1;
        }
        this.node.position = this.node.position.add(this.speed);
    }
}
