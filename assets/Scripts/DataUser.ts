import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Data')
export class Data extends Component {
    public static readonly sound = 'soundBounceChanllenge';
    public static gameVolume: number = 1;

    public static costShop: number = 0;
}
