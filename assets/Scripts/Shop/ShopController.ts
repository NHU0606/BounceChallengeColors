import { StoreAPI } from '../GameCenter/StoreAPI';
import { _decorator, Component, director, error, find, instantiate, Label, Node, Sprite, UITransform, Vec3 } from 'cc';
import { ShopView } from './ShopView';
import { ShopModel } from './ShopModel';
import { AudioController } from "../AudioController";
import { ShopValue } from '../ShopValue';
import { Data, DataUser } from '../DataUser';
import Constants from '../Data/Constants';
const { ccclass, property } = _decorator;

@ccclass('ShopController')
export class ShopController extends Component {
    @property({ type: AudioController })
    private audioControl: AudioController;

    @property({ type: ShopView})
    private shopView: ShopView;

    @property({ type: ShopModel })
    private shopModel: ShopModel;

    private shop: ShopValue;

    private gameClient;
    private userID: string;

    private cost: number[] = [0, 40, 80, 120, 160, 200, 240, 280, 320];
    private state: number[] = [0, 1, 1, 1, 1, 1, 1, 1, 1];
    private listItem: Node[] = [];

    private scoreShop: number;
    private newScore: number;

    protected async onLoad(): Promise<void> {
        let parameters = find('GameClient');
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        this.userID = this.gameClient.user.citizen.getCitizenId();
        
        this.cost = DataUser.dataUser.data.costState;
        this.state = DataUser.dataUser.data.state;
        this.scoreShop = DataUser.dataUser.data.cost;
        this.shopView.CostLabel.string = DataUser.dataUser.data.cost.toString();

        if ( find('Shop') === null) {
            const shopBallType = new Node('Shop');
            director.addPersistRootNode(shopBallType);
            this.shop = shopBallType.addComponent(ShopValue);
        } else {
            this.shop = find('Shop').getComponent(ShopValue);
        }
        
        for ( let i = 0; i < 9; i++) {
            const itemBallNode = instantiate(this.shopView.ItemBallPrefab);
            const labelcost = itemBallNode.getChildByName('Label').getComponent(Label);

            labelcost.string = this.cost[i].toString();

            const spriteBall = itemBallNode.getChildByName('Sprite').getComponent(Sprite);
            spriteBall.spriteFrame = this.shopModel.ItemTypeFrame[i];
            
            this.shopView.Container.addChild(itemBallNode);
            this.listItem.push(itemBallNode);
        }
        this.interacBtnShopTrue();
        this.renderState();
    }

    protected async renderState(): Promise<void> {
        this.listItem.forEach((item, index) => {
            item.on(Node.EventType.TOUCH_START, async() => {
                this.shopView.NoCostCloseBtn.interactable = true;
                this.shopView.LockChooseBtn.interactable = true;
                this.shopView.LockNoCostBtn.interactable = true;
                this.shopView.ChooseCloseBtn.interactable = true;
                this.shopView.ChooseBtn.interactable = true;
                this.shopView.CloseMainBtn.interactable = true;
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
                    
                        DataUser.dataUser.data.cost = this.scoreShop;
                        DataUser.dataUser.data.costState = this.cost;
                        DataUser.dataUser.data.state = this.state;
                        
                        await this.gameClient.user.data.setGameData( {[this.userID]: DataUser.dataUser}, false)
                            .then((response: any) => {
                            });

                        this.shop.StoreModel = index;
                        this.shopView.ChooseItemSprite.spriteFrame = this.shopModel.ItemTypeFrame[index];
                        this.shopView.ChooseItem.getComponent(UITransform).setContentSize(120, 120);
                        this.shopView.ChooseNode.active = true;
                    } else {
                        this.shopView.NoCost.active = true;
                    }
                }
            })
        })
    }

    private onClickCloseBtnNocost(): void {
        this.audioControl.onAudioArray(5);
        this.shopView.NoCost.active = false;
        this.interacBtnShop();
    }

    private onClickChooseCloseBtn(): void {
        this.audioControl.onAudioArray(5);
        this.shopView.ChooseCloseBtn.interactable = false;
        this.shopView.ChooseBtn.interactable = false;
        this.shopView.ChooseNode.active = false;
    }

    private async onClickChooseBall(): Promise<void> {
        this.audioControl.onAudioArray(5);
        let parameters = find('GameClient');
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;

        await gameClientParams.gameClient.match.startMatch()
            .then((data) => {
                gameClientParams.matchData = data;
            })
            .catch((error) => console.log(error));

        this.shopView.ChooseCloseBtn.interactable = false;
        this.shopView.ChooseBtn.interactable = false;
        director.loadScene(Constants.SCENE_NAME.Play);
    }

    private async onClickCloseMainBtn(): Promise<void> {
        this.audioControl.onAudioArray(5);
        this.interacBtnShop();
        this.shopView.CloseMainBtn.interactable = false;
        let parameters = find('GameClient');
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;

        await gameClientParams.gameClient.match.startMatch()
        .then((data) => {
            gameClientParams.matchData = data;
        })
        .catch((error) => console.log(error));

        director.loadScene(Constants.SCENE_NAME.Play);
    }

    private interacBtnShop(): void {
        this.shopView.NoCostCloseBtn.interactable = false;
        this.shopView.LockChooseBtn.interactable = false;
        this.shopView.LockNoCostBtn.interactable = false;
    }

    private interacBtnShopTrue(): void {
        this.shopView.NoCostCloseBtn.interactable = true;
        this.shopView.LockChooseBtn.interactable = true;
        this.shopView.LockNoCostBtn.interactable = true;
        this.shopView.ChooseCloseBtn.interactable = true;
        this.shopView.ChooseBtn.interactable = true;
        this.shopView.CloseMainBtn.interactable = true;
    }
}

