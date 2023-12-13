import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Data')
export class Data extends Component {
    public static readonly sound = 'soundBounceChanllenge';
    public static soundStatic: number = 1;

    public static costShop: number = 0;
}

export type DataGame = {
    data: {
        highscore: number,
        // cost: number,
        // state: number[],
        // costState: number[],
    }
}

export class DataUser {
    public static dataUser: DataGame = {
        data:{
            highscore: 0,
            // cost: 0,
            // state: [0, 1, 1, 1, 1, 1, 1, 1, 1],
            // costState: [0, 40, 80, 120, 160, 200, 240, 280, 320],
        }
    }
}
