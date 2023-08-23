import { Property } from './Property';

import { _decorator, Component, instantiate, Label, Node, Prefab, tween, UIOpacity, Vec3 } from 'cc';
import { Score } from './Score';
import { Data } from './Data';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({ type: Property})
    private property: Property;

    @property({ type: Score})
    private score: Score;

    public starPointCount: number = 0;
    public boomCount: number = 0;

    @property({type: Label})
    private highScore: Label;

    @property({type: Label})
    private urScore: Label;

    protected onLoad(): void {
        let opacityBtnPause = this.property.PauseBtn.getComponent(UIOpacity)

        opacityBtnPause.opacity = 0;
        this.property.PauseBtn.interactable = true;
        this.property.OverNode.active = false;
        this.property.GameNode.active = true;
        this.property.LeftContain.active = false;
        this.property.RightContain.active = false;
        this.property.GameNodeFake.active = true;
        this.property.TopInfoContain.active = false;
        
        setTimeout(()=> { 
            opacityBtnPause.opacity = 225;
            this.property.TopInfoContain.active = true;
        }, 4000);
        
    }

    public gameOver(): void {
        this.property.LeftContain.active = false;
        this.property.RightContain.active = false;
        this.overTopBottom();
        this.property.GameNode.active = false;
        this.property.PauseContain.active = false;

        setTimeout(()=> {
            this.property.GameNodeFake.active = false;
            this.property.OverNode.active = true;
            this.showScoreResult();
        }, 2000);
    }

    //----------TWEEN----------------

    public moveTween(container: Node, startPos: Vec3, endPos: Vec3, duration: number) {
        tween(container)
            .call(() => container.position = startPos)
            .to(duration, { position: endPos })
            .start();
    }

    public startTopBottom(): void {
        const topContain = this.property.TopContain;
        const bottomContain = this.property.BottomContain;

        const startPosTop = new Vec3(0, 550, 0);
        const endPosTop = new Vec3(0, 370, 0);

        const startPosBottom = new Vec3(0, -550, 0);
        const endPosBottom = new Vec3(0, -370, 0);

        this.moveTween(topContain, startPosTop, endPosTop, 0.5);
        this.moveTween(bottomContain, startPosBottom, endPosBottom, 0.5);
    }

    public overTopBottom(): void {
        const topContain = this.property.TopContain;
        const bottomContain = this.property.BottomContain; 

        const startPosTop = new Vec3(0, 550, 0);
        const endPosTop = new Vec3(0, 370, 0);

        const startPosBottom = new Vec3(0, -550, 0);
        const endPosBottom = new Vec3(0, -370, 0);

        this.moveTween(topContain, endPosTop, startPosTop, 0.5);
        this.moveTween(bottomContain, endPosBottom, startPosBottom, 0.5);
    }

    private onClickPause(): void {
        let opacityBtnPause = this.property.PauseBtn.getComponent(UIOpacity)
        opacityBtnPause.opacity = 0;
        this.property.PauseInfo.active = true;
        this.property.PauseBtn.interactable = false;
        this.property.GameNode.active = false;
        this.property.TopContain.active = false;
        this.property.BottomContain.active = false;
    }

    private onClickContinue(): void {
        let opacityBtnPause = this.property.PauseBtn.getComponent(UIOpacity)
        opacityBtnPause.opacity = 255;
        this.property.PauseInfo.active = false;
        this.property.PauseBtn.interactable = true;
        this.property.GameNode.active = true;
        this.property.TopContain.active = true;
        this.property.BottomContain.active = true;
    }

    //----------------SPAWN PREFAB------------------------

    private spawnPrefab(prefab: Prefab, container: Node, count: number) {
        container.removeAllChildren();
    
        for (let i = 0; i < count; i++) {
            const objectInstance = instantiate(prefab);
    
            const maxX = container.width / 2;
            const maxY = container.height / 2;
            const randomX = Math.random() * (maxX * 2) - maxX;
            const randomY = Math.random() * (maxY * 2) - maxY;
    
            objectInstance.setPosition(randomX, randomY, 0);
            container.addChild(objectInstance);
        }
        return count;
    }

    public spawnStarPoint(count: number): void {
        const starPrefab = this.property.StarPoint;
        const starContain = this.property.StarPointContain;
    
        this.starPointCount += this.spawnPrefab(starPrefab, starContain, count);
    }
    
    public spawnBoom(count: number): void {
        const boomPrefab = this.property.BoomPrefab;
        const boomContain = this.property.BoomContain;
    
        this.boomCount += this.spawnPrefab(boomPrefab, boomContain, count);
    }

    public showScoreResult() {
        try {
            let maxScore = parseInt(localStorage.getItem(Data.highscore));
            this.highScore.string = String(maxScore);
            this.urScore.string = String(this.score.currentScore);
        } catch (error) {
            this.highScore.string = String(Data.highScoreStatic);
            this.urScore.string = String(this.score.currentScore);
        }
    }
}

