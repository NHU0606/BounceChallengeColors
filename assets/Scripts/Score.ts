import { _decorator, Component, Label, LabelComponent, Node } from 'cc';
import { RequestController } from './RequestController';
const { ccclass, property } = _decorator;

@ccclass('Score')
export class Score extends Component {
    @property({ type: Label })
    public scoreLabel: Label;

    @property({ type: RequestController })
    private requestController: RequestController;

    @property({ type: Label })
    private heartLabel: Label;

    public currentScore: number = 0;
    public heart: number = 3;

    public updateHeart(num: number): void {
        this.heart = num;
        this.heartLabel.string = String(this.heart);
    }

    public minusHeart(): void {
        this.updateHeart(this.heart - 1);
    }

    public plusHeart(): void {
        if ( this.heart >= 3 ) return;

        if ( this.heart < 3 ) {
            this.updateHeart(this.heart + 1);
        } 
    }

    public minus3Heart(): void {
        this.updateHeart(this.heart - 3);
    }

    public addStar(): void {
        this.updateScore(this.currentScore + 3);
    }

    public addScore(): void {
        this.updateScore(this.currentScore + 1);
    }

    async updateScore(num:number){
        this.currentScore = num;
        this.scoreLabel.string = String(this.currentScore);
        let maxScore = parseInt(localStorage.getItem('highscore'))

        if(maxScore < num) {
            let formData = new FormData();
            formData.append("ranking[level]", "0");
            formData.append("ranking[score]", num.toString());
            let res =  this.requestController.post(formData, '/ranking');

            localStorage.setItem('highscore', num.toString())
        }
    }

    
    public getScore(): number {
        return this.currentScore;
    }
}

