import { Property } from './Property';
import { _decorator, Color, Component, director, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, tween, UIOpacity, Vec3 } from 'cc';
import { Score } from './Score';
import { AudioController } from "./AudioController";
import Constants from './Data/Constants';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({ type: Property})
    private property: Property;

    @property({ type: AudioController })
    private audioControl: AudioController;

    @property({ type: Score})
    private score: Score;

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
        const endPosTop = new Vec3(0, 400, 0);

        const startPosBottom = new Vec3(0, -550, 0);
        const endPosBottom = new Vec3(0, -400, 0);

        this.moveTween(topContain, startPosTop, endPosTop, 0.5);
        this.moveTween(bottomContain, startPosBottom, endPosBottom, 0.5);
    }

    public overTopBottom(): void {
        const topContain = this.property.TopContain;
        const bottomContain = this.property.BottomContain; 

        const startPosTop = new Vec3(0, 550, 0);
        const endPosTop = new Vec3(0, 400, 0);

        const startPosBottom = new Vec3(0, -550, 0);
        const endPosBottom = new Vec3(0, -400, 0);

        this.moveTween(topContain, endPosTop, startPosTop, 0.5);
        this.moveTween(bottomContain, endPosBottom, startPosBottom, 0.5);
    }

    private onClickPause(): void {
        this.property.ShopBtn.node.active = true;
        let opacityBtnPause = this.property.PauseBtn.getComponent(UIOpacity)
        opacityBtnPause.opacity = 0;
        this.property.PauseInfo.active = true;
        this.property.PauseBtn.interactable = false;
        this.property.GameNode.active = false;
        this.audioControl.node.active = true;
        this.property.TopContain.active = false;
        this.property.BottomContain.active = false;
        this.property.GameNodeFake.active = false;
        this.property.GameNode.active = false;
    }

    private onClickContinuePause(): void {
        this.property.ShopBtn.node.active = false;
        this.audioControl.node.active = false;

        let opacityBtnPause = this.property.PauseBtn.getComponent(UIOpacity)
        opacityBtnPause.opacity = 255;
        this.property.PauseInfo.active = false;
        this.property.PauseBtn.interactable = true;
        this.property.GameNode.active = true;
        this.property.TopContain.active = true;
        this.property.BottomContain.active = true;
        this.property.GameNodeFake.active = true;
        this.property.GameNode.active = true;
    }

    private onClickHomePause(): void {
        this.interactableBtnPause();
        director.loadScene(Constants.SCENE_NAME.Entry);
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
        director.loadScene(Constants.SCENE_NAME.Shop);
    }

    public getRandomColor(): Color {
        const colors = [
            new Color(228,228,208),   
            new Color(168,223,142), 
            new Color(173,196,206), 
            new Color(161,204,209), 
            new Color(182,234,218), 
            new Color(160,196,157), 
            new Color(150,182,197), 
            new Color(198,131,215), 
            new Color(124,147,195), 
            new Color(45,149,150), 
            new Color(45,149,150), 
        ];
    
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
}

