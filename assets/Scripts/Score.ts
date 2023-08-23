import { Data } from './Data';
import { _decorator, Component, Label, LabelComponent, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Score')
export class Score extends Component {
    @property({ type: Label })
    private scoreLabel: Label;

    @property({ type: Label })
    private starLabel: Label;

    @property({ type: Label })
    private heartLabel: Label;

    public currentScore: number = 0;
    public currentStar: number = 0;
    public heart: number = 3;

    public updateHeart(num: number): void {
        this.heart = num;
        this.heartLabel.string = String(this.heart);
    }

    public minusHeart(): void {
        this.updateHeart(this.heart - 1);
    }

    public minus3Heart(): void {
        this.updateHeart(this.heart - 3);
    }


    public updateStar(num: number): void {
        this.currentStar = num;
        this.starLabel.string = String(this.currentStar);
    }

    public addStar(): void {
        this.updateStar(this.currentStar + 1);
    }

    public updateScore(num: number): void {
        try {
            this.currentScore = num;
            this.scoreLabel.string = String(this.currentScore);

            let maxScore = parseInt(localStorage.getItem(Data.highscore));

            if ( maxScore < num ) {
                localStorage.setItem(Data.highscore, num.toString());
            } else {
                if ( Data.highScoreStatic < num ) Data.highScoreStatic = num;
            }
        }
        catch (error) {
            if (Data.highScoreStatic < num) Data.highScoreStatic = num;
        }
    }

    public addScore(): void {
        this.updateScore(this.currentScore + 1);
    }

    
}
