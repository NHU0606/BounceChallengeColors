import { _decorator, Component, director, find, instantiate, Label, Node, Sprite, Vec3 } from 'cc';
import { ShopView } from './ShopView';
import { ShopModel } from './ShopModel';
import { ShopValue } from '../ShopValue';
const { ccclass, property } = _decorator;

@ccclass('ShopController')
export class ShopController extends Component {
    @property({ type: ShopView})
    private shopView: ShopView;

    @property({ type: ShopModel })
    private shopModel: ShopModel;

    private shop: ShopValue;

    private cost: number[] = [0, 40, 80, 120, 140, 160, 180, 200, 220];
    private state: number[] = [0, 1, 1, 1, 1, 1, 1, 1, 1];
    private listItem: Node[] = [];

    private scoreStore: number;
    private newScore: number;

    protected onLoad(): void {
        if ( find('Shop') === null) {
            const shopBallType = new Node('Shop');
            director.addPersistRootNode(shopBallType);
            this.shop = shopBallType.addComponent(ShopValue);
        } else {
            this.shop = find('Shop').getComponent(ShopValue);
        }

        for ( let i = 0; i < 9; i++) {
            const itemBallNode = instantiate(this.shopView.ItemBallPrefab);
            const labelCost = itemBallNode.getChildByName('Label').getComponent(Label);

            labelCost.string = this.cost[i].toString();

            const spriteBall = itemBallNode.getChildByName('Sprite').getComponent(Sprite);
            spriteBall.spriteFrame = this.shopModel.ItemTypeFrame[i];
            
            let offsetX = -3 * 150 * 0.5 + 150 * 0.5;
            let offsetY = -3 * 150 * 0.5 + 150 * 0.5;

            this.shopView.Container.addChild(itemBallNode);
            const r = Math.floor(i / 3);
            const c = i % 3;
            const x = c * 150 + offsetX;
            const y = r * 150 + offsetY;
            itemBallNode.setPosition(new Vec3(x, -y, 0));
            this.listItem.push(itemBallNode);
        }
    }

    protected renderState(): void {
        this.listItem.forEach((item, index) => {
            
        })
    }
}

