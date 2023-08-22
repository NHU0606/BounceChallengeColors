import { _decorator, Component, Label, LabelComponent, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Score')
export class Score extends Component {
    @property({ type: Label })
    private scoreLabel: Label;

    public currentScore: number = 0;

    public updateScore(num: number): void {
        this.currentScore = num;
        this.scoreLabel.string = String(this.currentScore);
    }

    public addScore(){
        this.updateScore(this.currentScore + 1);
    }

    
}

