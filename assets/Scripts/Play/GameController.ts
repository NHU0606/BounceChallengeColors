import { _decorator, Animation, Collider2D, Component, Contact2DType, director, instantiate, IPhysics2DContact, Node, Prefab, tween, UIOpacity, Vec3 } from 'cc';
import { Score } from '../Score';
import { Property } from '../Property';
import { BallController } from './BallController';
import { GameView } from '../GameView';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property({ type: Property })
    private property: Property;

    @property({ type: GameView})
    private gameView: GameView;

    @property({ type: Score})
    private score: Score;

    private countObstacle: number = 0;
    private ball: BallController;

    private animContain: Animation | null = null;
    private animStar: Animation | null = null;

    protected onLoad(): void {
        setTimeout(()=> { 
            this.gameView.startTopBottom();
        }, 3000);

        this.ball = this.property.BallNode.getComponent(BallController);

        let collider = this.ball.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected start(): void {
        this.animContain = this.property.AnimContain.getComponent(Animation);
        this.animStar = this.property.AnimTouchStar.getComponent(Animation);
    }

    protected update(dt: number): void {
        this.changeDirectionBall();
    }

    private onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ): void {
        const otherTag = otherCollider.tag;

        if ( otherTag === 1 ) {
            this.score.minus3Heart();
        } else
        if ( otherTag === 3 ) {
            this.score.minusHeart();
            this.animContain.play("BallGameOver");
            this.property.AnimContain.setPosition(this.property.BallNode.position.x, this.property.BallNode.position.y, 0);

        } else 
        if ( otherTag === 4 ) {
            this.score.addStar();
            this.animStar.play("TouchStar");
            this.property.AnimTouchStar.setPosition(this.property.BallNode.position.x, this.property.BallNode.position.y, 0);

            const starts = this.property.StarPointContain.children;
            for (let i = 0; i < starts.length; i++) {
                if (starts[i] === otherCollider.node ) { 
                    starts[i].active = false; 

                    setTimeout(() => {
                        starts[i].active = true;
                    }, 7000)
                }
            }

        } else if ( otherTag === 5 ) {
            this.score.minusHeart();
            this.animContain.play("BallGameOver");
            this.property.AnimContain.setPosition(this.property.BallNode.position.x, this.property.BallNode.position.y, 0);

            const booms = this.property.BoomContain.children;
            for( let i = 0; i < booms.length; i++) {
                if ( booms[i] === otherCollider.node ) {
                    booms[i].active = false;

                    setTimeout(() => {
                        booms[i].active = true;
                    }, 7000)
                }
            }
        }
        if ( this.score.heart <= 0 ) {
            this.gameView.gameOver();
        }
    }

    private createObstacle(side: 'left' | 'right', count: number): void {
        const container = side === 'left' ? this.property.LeftContain : this.property.RightContain;
        const prefab = side === 'left' ? this.property.ObstaclePrefabLeft : this.property.ObstaclePrefabRight;
    
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
        
        if (this.property.BallNode.position.x >= 218) {
            this.animContain.play('BallBounce')
            this.property.AnimContain.setPosition(this.property.BallNode.position.x, this.property.BallNode.position.y, 0);
            // this.createObstacle('left', this.countObstacle);
            this.property.LeftContain.active = true;
            this.property.RightContain.active = false;
        } else if (this.property.BallNode.position.x <= -218) {
            this.animContain.play('BallBounce');
            this.property.AnimContain.setPosition(this.property.BallNode.position.x, this.property.BallNode.position.y, 0);
            // this.createObstacle('right', this.countObstacle);
            this.property.LeftContain.active = false;
            this.property.RightContain.active = true;
        }

        if (this.score.currentScore > 1 && this.gameView.starPointCount < 2 && this.score.currentScore % 4 === 0) {
            this.gameView.spawnStarPoint(3);
        }

        if (this.score.currentScore > 1 && this.gameView.boomCount < 2 && this.score.currentScore % 3 === 0) {
            this.gameView.spawnBoom(2);
        }

        this.property.StarPointContain.active = this.score.currentScore % 4 === 0;
        this.property.BoomContain.active = this.score.currentScore % 3 === 0;
    }
}


