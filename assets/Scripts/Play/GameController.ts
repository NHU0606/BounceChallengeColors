import { _decorator, Animation, Collider2D, color, Color, Component, Contact2DType, director, find, instantiate, IPhysics2DContact, Label, Node, Prefab, Sprite, tween, UIOpacity, Vec3 } from 'cc';
import { Score } from '../Score';
import { Property } from '../Property';
import { BallController } from './BallController';
import { AudioController } from "../AudioController";
import { GameView } from '../GameView';
import { ShopValue } from '../ShopValue';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property({ type: Property })
    private property: Property;

    @property({ type: AudioController })
    private audioControl: AudioController;

    @property({ type: GameView})
    private gameView: GameView;

    @property({ type: Score})
    private score: Score;

    private countObstacle: number = 0;
    private ball: BallController;
    private shop: number;

    private animContain: Animation | null = null;
    private animStar: Animation | null = null;
    private laneObstacle: boolean[][] = [];
    private createdObstacleCount: number = 0;
    private obstacleColor: Color = new Color(131, 180, 255);

    protected onLoad(): void {
        setTimeout(()=> { 
            this.gameView.startTopBottom();
        }, 3000);

        this.ball = this.property.BallNode.getComponent(BallController);

        let collider = this.ball.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        for (let i = 0; i < 5; i++) {
            this.laneObstacle[i] = [];
        }

        if ( find('Shop') === null ) {
            this.shop = 0;
        } else {
            this.shop = find('Shop').getComponent(ShopValue).StoreModel;
        }

        this.property.BallSprite.spriteFrame = this.property.BallSpriteFrame[this.shop];
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
        contact: IPhysics2DContact | null, 
        score: number
    ): void {
        const otherTag = otherCollider.tag;
        if ( otherTag === 1 ) {
            this.audioControl.onAudioArray(1);
            this.score.minus3Heart();
        } else
        if ( otherTag === 3 ) {
            this.audioControl.onAudioArray(1);
            this.score.minusHeart();
            this.animContain.play("BallGameOver");
            this.property.AnimContain.setPosition(this.property.BallNode.position.x, this.property.BallNode.position.y, 0);

        } else if ( otherTag === 4 ) {
            this.audioControl.onAudioArray(3);
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
            this.audioControl.onAudioArray(1);
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
        } else if ( otherTag === 6 ) {
            this.audioControl.onAudioArray(1);
            const newColor = this.gameView.getRandomColor();
            const leftLine = this.property.LeftLine.getComponent(Sprite);
            const leftFakeLine = this.property.LeftFakeLine.getComponent(Sprite);
            const rightLine = this.property.RightLine.getComponent(Sprite);
            const rightFakeLine = this.property.RightFakeLine.getComponent(Sprite);
            const topLine = this.property.TopContain.getComponent(Sprite);
            const bottomLine = this.property.BottomContain.getComponent(Sprite);
            const scoreLabel = this.score.scoreLabel.getComponent(Label);
            if ( leftLine || rightLine || topLine || leftFakeLine || rightFakeLine || scoreLabel) {
                leftLine.color = newColor;
                leftFakeLine.color = leftLine.color;
                rightLine.color = leftLine.color;
                rightFakeLine.color = leftLine.color;
                topLine.color = leftLine.color;
                bottomLine.color = leftLine.color;
                scoreLabel.color = leftLine.color;
            }

            const boomsColor = this.property.BoomColorContain.children;
            for( let i = 0; i < boomsColor.length; i++) {
                if ( boomsColor[i] === otherCollider.node ) {
                    boomsColor[i].active = false;

                    setTimeout(() => {
                        boomsColor[i].active = true;
                    }, 2000)
                }
            }

            this.obstacleColor = leftLine.color;

            this.applyColorToObstacles(this.property.LeftContain, leftLine.color);
            this.applyColorToObstacles(this.property.RightContain, leftLine.color);
        }
        if ( this.score.heart <= 0 ) {
            this.gameView.gameOver();
        }
    }

    private applyColorToObstacles(container: Node, color: Color): void {
        const obstacleInstances = container.children;
    
        for (let i = 0; i < obstacleInstances.length; i++) {
            const obstacleInstance = obstacleInstances[i];
            const spriteObstacle = obstacleInstance.getComponent(Sprite);
            if (spriteObstacle) {
                spriteObstacle.color = color;
            }
        }
    }

    private createObstacle(side: 'left' | 'right', count: number, color: Color): void {
        const container = side === 'left' ? this.property.LeftContain : this.property.RightContain;
        const prefab = side === 'left' ? this.property.ObstaclePrefabLeft : this.property.ObstaclePrefabRight;
        
        container.removeAllChildren();
        
        const selectedLaneIndices: number[] = [];
        let availableLaneIndices: number[] = [0, 1, 2, 3, 4]; 
    
        while (selectedLaneIndices.length < count && availableLaneIndices.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableLaneIndices.length);
            const laneIndex = availableLaneIndices[randomIndex];
            selectedLaneIndices.push(laneIndex);
            availableLaneIndices.splice(randomIndex, 1); 
            if ( this.createdObstacleCount <= 4 ) {
                this.createdObstacleCount++;
            }
        }
    
        for (let i = 0; i < selectedLaneIndices.length; i++) {
            const laneIndex = selectedLaneIndices[i];
            this.laneObstacle[laneIndex].push(true); 

            const obstacleInstance = instantiate(prefab);
            const spriteObstacle = obstacleInstance.getComponent(Sprite);

            if (spriteObstacle) {
                spriteObstacle.color = color;
            }
    
            const laneHeight = container.height / 5;
            const obstaclePosY = laneIndex * laneHeight;
    
            obstacleInstance.active = false;
            const startPos = new Vec3(side === 'left' ? -300 : 300, obstaclePosY, 0);
            const endPos = new Vec3(
                side === 'left' ? 30 : -30,
                obstaclePosY,
                0
            );
    
            tween(obstacleInstance)
                .call(() => obstacleInstance.active = true)
                .to(0.3, { position: endPos })
                .start();
    
            obstacleInstance.setPosition(startPos.add(new Vec3(i * 70, 0, 0)));
            container.addChild(obstacleInstance);
        }
    }

    private changeDirectionBall(): void {
        if ( this.countObstacle <= 5 ) {
            this.countObstacle = Math.floor(this.score.currentScore / 5) + 2;
        }
        
        if (this.property.BallNode.position.x >= 218) {
            this.audioControl.onAudioArray(4);
            this.animContain.play('BallBounce')
            this.property.AnimContain.setPosition(this.property.BallNode.position.x, this.property.BallNode.position.y, 0);
            this.createObstacle('left', this.countObstacle, this.obstacleColor);
            this.property.LeftContain.active = true;
            this.property.RightContain.active = false;
        } else if (this.property.BallNode.position.x <= -218) {
            this.audioControl.onAudioArray(4);
            this.animContain.play('BallBounce');
            this.property.AnimContain.setPosition(this.property.BallNode.position.x, this.property.BallNode.position.y, 0);
            this.createObstacle('right', this.countObstacle, this.obstacleColor);
            this.property.LeftContain.active = false;
            this.property.RightContain.active = true;
        }

        if (this.score.currentScore > 1 && this.gameView.starPointCount < 2 && this.score.currentScore % 4 === 0) {
            this.gameView.spawnStarPoint(3);
        }

        if (this.score.currentScore > 1 && this.gameView.boomCount < 2 && this.score.currentScore % 5 === 0) {
            this.gameView.spawnBoom(2);
        }

        if (this.score.currentScore > 1 && this.gameView.boomColorCount < 2 && this.score.currentScore % 10 === 0) {
            this.gameView.spawnBoomColor(1);
        }

        this.property.StarPointContain.active = this.score.currentScore % 4 === 0;
        this.property.BoomContain.active = this.score.currentScore % 5 === 0;
        this.property.BoomColorContain.active = this.score.currentScore % 10 === 0;
    }
}


