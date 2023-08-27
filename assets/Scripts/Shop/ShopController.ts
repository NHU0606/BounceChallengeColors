import { _decorator, Component, director, find, instantiate, Label, Node, Sprite, UITransform, Vec3 } from 'cc';
import { ShopView } from './ShopView';
import { ShopModel } from './ShopModel';
import { ShopValue } from '../ShopValue';
import { SCENE_NAME } from '../Data';
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

    private scoreShop: number = 200;
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
            
            this.shopView.Container.addChild(itemBallNode);
            this.listItem.push(itemBallNode);
        }
        this.renderState();
    }

    protected renderState(): void {
        this.listItem.forEach((item, index) => {
            item.on(Node.EventType.TOUCH_START, () => {
                if ( this.state[index] === 0 ) {
                    this.shop.StoreModel = index;
                    this.shopView.ChooseItemSprite.spriteFrame = this.shopModel.ItemTypeFrame[index];
                    this.shopView.ChooseItem.getComponent(UITransform).setContentSize(120, 120);
                    this.shopView.ChooseNode.active = true;
                } else {
                    if ( this.scoreShop >= this.cost[index] ) {
                        this.newScore = this.scoreShop - this.cost[index];
                        this.shopView.CostLabel.string = this.newScore.toString();

                        this.state[index] = 0;
                        this.cost[index] = 0;

                        item.getChildByName('Label').getComponent(Label).string = this.cost[index].toString();
                    } else {
                        this.shopView.NoCost.active = true;
                    }
                }
            })
        })
    }

    private onClickCloseBtnNoCost(): void {
        this.shopView.NoCost.active = false;
        this.shopView.LockChooseBtn.interactable = false;
    }

    private onClickChooseCloseBtn(): void {
        this.shopView.LockNoCostBtn.interactable = false;
        this.shopView.ChooseNode.active = false;
    }

    private onClickChooseBall(): void {
        director.loadScene(SCENE_NAME.Play);
    }

    private onClickCloseMainBtn(): void {
        director.loadScene(SCENE_NAME.Entry);
    }
}

