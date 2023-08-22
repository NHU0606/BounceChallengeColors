import { _decorator, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, Node, tween, Vec3 } from 'cc';
import { Score } from './Score';
import { GameView } from './GameView';
import { BallController } from './BallController';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property({ type: GameView })
    private gameView: GameView;

    @property({ type: Score})
    private score: Score;

    private countObstacle: number = 0;
    private ball: BallController;

    protected onLoad(): void {
        this.gameView.OverNode.active = false;
        this.gameView.GameNode.active = true;
        this.gameView.LeftContain.active = false;
        this.gameView.RightContain.active = false;
        this.gameView.GameNodeFake.active = true;

        
        setTimeout(()=> { this.startTopBottom() }, 3000)

        this.ball = this.gameView.BallNode.getComponent(BallController);

        let collider = this.ball.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected update(dt: number): void {
        this.changeDirectionBall();
        this.checkDie();
    }

    private onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ): void {
        const otherTag = otherCollider.tag;

        if ( otherTag === 3 ) {
            this.gameOver();
        }
       
    }

    private checkDie(): void {
        let posY = this.gameView.BallNode.position.y;
        if( posY >= 305|| posY <= -305) {
            this.gameOver();
        }
    }

    private gameOver(): void {
        this.overTopBottom();

        this.gameView.LeftContain.active = false;
        this.gameView.RightContain.active = false;
        // this.gameView.GameNode.active = false;

        // setTimeout(()=> {
        // }, 1500);
        setTimeout(()=> {
            // this.gameView.GameNodeFake.active = false;
            this.gameView.OverNode.active = true;
        }, 2500);
    }


    private createObstacle(side: 'left' | 'right', count: number): void {
        const container = side === 'left' ? this.gameView.LeftContain : this.gameView.RightContain;
        const prefab = side === 'left' ? this.gameView.ObstaclePrefabLeft : this.gameView.ObstaclePrefabRight;
    
        container.removeAllChildren();
    
        const obstacle = instantiate(prefab);
        const obstacleHeight = obstacle.height;
    
        let totalPossibleSpace = container.height - count * obstacleHeight;
    
        let posYCandidates: number[] = [];
    
        for (let i = 0; i < count; i++) {
            posYCandidates.push(Math.floor(Math.random() * totalPossibleSpace));
        }
    
        for (let i = 0; i < count; i++) {
            const obstacleInstance = instantiate(prefab);
            container.addChild(obstacleInstance);
    
            obstacleInstance.active = false;
            const endPosY = posYCandidates[i];
            const startPos = new Vec3(side === 'left' ? -300 : 300, endPosY - totalPossibleSpace / count, 0);
    
            const endPos = new Vec3(
                side === 'left' ? 30 : -30,
                endPosY - totalPossibleSpace / count,
                0
            );

            tween(obstacleInstance)
                .call(() => obstacleInstance.active = true)
                .to(0.1, { position: endPos })
                .start();
    
            obstacleInstance.setPosition(startPos.add(new Vec3(i * obstacleHeight, 0, 0)));
    
            totalPossibleSpace -= obstacleHeight;
        }
    }

    private changeDirectionBall(): void {
        if ( this.countObstacle <= 5 ) {
            this.countObstacle = Math.floor(this.score.currentScore / 5) + 2;
        }
        
        if (this.gameView.BallNode.position.x >= 218) {
            this.createObstacle('left', this.countObstacle);
            this.gameView.LeftContain.active = true;
            this.gameView.RightContain.active = false;
        } else if (this.gameView.BallNode.position.x <= -218) {
            this.createObstacle('right', this.countObstacle);
            this.gameView.LeftContain.active = false;
            this.gameView.RightContain.active = true;
        }
    }

    
    //----------TWEEN----------------

    private moveTween(container: Node, startPos: Vec3, endPos: Vec3, duration: number) {
        tween(container)
            .call(() => container.position = startPos)
            .to(duration, { position: endPos })
            .start();
    }

    private startTopBottom(): void {
        const topContain = this.gameView.TopContain;
        const bottomContain = this.gameView.BottomContain;

        const startPosTop = new Vec3(0, 550, 0);
        const endPosTop = new Vec3(0, 370, 0);

        const startPosBottom = new Vec3(0, -550, 0);
        const endPosBottom = new Vec3(0, -370, 0);

        this.moveTween(topContain, startPosTop, endPosTop, 0.5);
        this.moveTween(bottomContain, startPosBottom, endPosBottom, 0.5);
    }

    private overTopBottom(): void {
        const topContain = this.gameView.TopContain;
        const bottomContain = this.gameView.BottomContain; 

        const startPosTop = new Vec3(0, 550, 0);
        const endPosTop = new Vec3(0, 370, 0);

        const startPosBottom = new Vec3(0, -550, 0);
        const endPosBottom = new Vec3(0, -370, 0);

        this.moveTween(topContain, endPosTop, startPosTop, 0.5);
        this.moveTween(bottomContain, endPosBottom, startPosBottom, 0.5);
        topContain.active = false;
        bottomContain.active = false;
    }
}


