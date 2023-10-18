import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopValue')
export class ShopValue extends Component {
    @property({ type: CCInteger })
    private storeModel: number = 0;

    public get StoreModel(): number {
        return this.storeModel;
    }
    public set StoreModel(value: number) {
        this.storeModel = value;
    }
}

