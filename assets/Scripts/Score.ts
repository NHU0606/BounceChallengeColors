import { _decorator, Component, Label, LabelComponent, Node } from 'cc';
import { Data, DataGame, DataUser } from './DataUser';
const { ccclass, property } = _decorator;

@ccclass('Score')
export class Score extends Component {
    @property({ type: Label })
    public scoreLabel: Label;

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

    public updateScore(num: number): void {
        this.currentScore = num;
        this.scoreLabel.string = String(this.currentScore);
    }


    public addScore(): void {
        this.updateScore(this.currentScore + 1);

        if ( this.currentScore > DataUser.dataUser.data.highscore ) {
            DataUser.dataUser.data.highscore = this.currentScore;
        }
    }

    public getScore(): number {
        return this.currentScore;
    }
}

