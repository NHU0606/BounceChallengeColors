import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopValue')
export class ShopValue extends Component {
    @property({
        type: CCInteger,
      })

    private storeBall: number = 0;
    StoreModel: number;
    public get StoreBall(): number {
        return this.storeBall;
    }
    public set StoreBall(value: number) {
        this.storeBall = value;
    }
}

