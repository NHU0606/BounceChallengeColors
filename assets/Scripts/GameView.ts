import { Property } from './Property';
import { _decorator, Color, Component, director, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, tween, UIOpacity, Vec3 } from 'cc';
import { Score } from './Score';
import { AudioController } from "./AudioController";
import { Data, DataUser, SCENE_NAME } from './Data';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({ type: Property})
    private property: Property;

    @property({ type: AudioController })
    private audioControl: AudioController;

    @property({ type: Score})
    private score: Score;

    // public starPointCount: number = 0;
    // public boomCount: number = 0;
    // public boomColorCount: number = 0;

    @property({ type: [Node] }) 
    private starEnd: Node[] = [];

    protected onLoad(): void {
        let opacityBtnPause = this.property.PauseBtn.getComponent(UIOpacity)

        opacityBtnPause.opacity = 0;
        this.interacBtnTrue();
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

        for ( let i = 0; i < this.starEnd.length; i++) {
            this.starEnd[i].active = false;
        }
    }

    public updateStars(): void {
        let score = this.score.currentScore;
        let starsToShow = 0;

        if (score > 99) {
            starsToShow = 3;
        } else if (score >= 50 && score <= 99) {
            starsToShow = 2;
        } else if (score >= 10 && score <= 49) {
            starsToShow = 1;
        }
    
        for (let i = 0; i < this.starEnd.length; i++) {
            const starNode = this.starEnd[i];
            const isActive = i < starsToShow;
    
            starNode.active = isActive;
        }
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
        this.audioControl.onAudioArray(5);

      this.property.ShopBtn.node.active = true;
        let opacityBtnPause = this.property.PauseBtn.getComponent(UIOpacity)
        opacityBtnPause.opacity = 0;
        this.property.PauseInfo.active = true;
        this.property.PauseBtn.interactable = false;
        this.property.GameNode.active = false;
        this.property.ContainImgSoundContain.active = true;
        this.property.TopContain.active = false;
        this.property.BottomContain.active = false;
    }

    private onClickContinuePause(): void {
        this.audioControl.onAudioArray(5);
        this.property.ShopBtn.node.active = false;
        this.property.ContainImgSoundContain.active = false;

        let opacityBtnPause = this.property.PauseBtn.getComponent(UIOpacity)
        opacityBtnPause.opacity = 255;
        this.property.PauseInfo.active = false;
        this.property.PauseBtn.interactable = true;
        this.property.GameNode.active = true;
        this.property.TopContain.active = true;
        this.property.BottomContain.active = true;
    }

    private onClickHomePause(): void {
        this.interactableBtnPause();
        this.audioControl.onAudioArray(5);
        director.loadScene(SCENE_NAME.Entry);
    }

    public interactableBtnPause(): void {
        this.property.ReplayBtn.interactable = false;
        this.property.HomeBtn.interactable = false;
        this.property.ContinueBtn.interactable = false;
    }

    private interacBtnTrue(): void {
        this.property.PauseBtn.interactable = true;
        this.property.HomeBtn.interactable = true;
        this.property.ContinueBtn.interactable = true;
    }

    private onClickShopBtn(): void {
        this.audioControl.onAudioArray(5);
        director.loadScene(SCENE_NAME.Shop);
    }

    //----------------SPAWN PREFAB------------------------

    // private spawnPrefab(prefab: Prefab, container: Node, count: number) {
    //     container.removeAllChildren();
    
    //     for (let i = 0; i < count; i++) {
    //         const objectInstance = instantiate(prefab);
    
    //         const maxX = container.width / 2;
    //         const maxY = container.height / 2;
    //         const randomX = Math.random() * (maxX * 2) - maxX;
    //         const randomY = Math.random() * (maxY * 2) - maxY;
    
    //         objectInstance.setPosition(randomX, randomY, 0);
    //         objectInstance.active = true;
    //         container.addChild(objectInstance);
    //     }
    //     return count;
    // }

    // public spawnStarPoint(count: number): void {
    //     const starPrefab = this.property.StarPoint;
    //     const starContain = this.property.StarPointContain;
    
    //     starContain.removeAllChildren();
    //     this.starPointCount += this.spawnPrefab(starPrefab, starContain, count);
    // }
    
    // public spawnBoom(count: number): void {
    //     const boomPrefab = this.property.BoomPrefab;
    //     const boomContain = this.property.BoomContain;
    
    //     boomContain.removeAllChildren();
    //     this.boomCount += this.spawnPrefab(boomPrefab, boomContain, count);
    // }

    // public spawnBoomColor(count: number): void {
    //     const boomColorPrefab = this.property.BoomColorPrefab;
    //     const boomColorContain = this.property.BoomColorContain;
    
    //     boomColorContain.removeAllChildren();
    //     this.boomColorCount += this.spawnPrefab(boomColorPrefab, boomColorContain, count);
    // }

 
    public getRandomColor(): Color {
        const colors = [
            new Color(255,183,183),  
            new Color(228,228,208),   
            new Color(168,223,142), 
            new Color(240,184,110), 
            new Color(173,196,206), 
            new Color(161,204,209), 
            new Color(182,234,218), 
            new Color(160,196,157), 
            new Color(150,182,197), 
        ];
    
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
}

