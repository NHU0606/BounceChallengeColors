import { StoreAPI } from './../StoreAPI';
import { _decorator, Component, director, error, find, instantiate, Label, Node, Sprite, UITransform, Vec3 } from 'cc';
import { ShopView } from './ShopView';
import { ShopModel } from './ShopModel';
import { AudioController } from "../AudioController";
import { ShopValue } from '../ShopValue';
import { DataUser, SCENE_NAME } from '../Data';
const { ccclass, property } = _decorator;
let matchId: string;

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
        
        if ( find('Shop') === null) {
            const shopBallType = new Node('Shop');
            director.addPersistRootNode(shopBallType);
            this.shop = shopBallType.addComponent(ShopValue);
        } else {
            this.shop = find('Shop').getComponent(ShopValue);
        }
        
        await this.gameClient.user.data.getGameData().then((response) => {
            this.shopView.CostLabel.string = DataUser.dataUser.data.cost.toString();
            this.cost = DataUser.dataUser.data.costState;
        })
        .catch(async (e) => {
            console.log(e);
        })

        for ( let i = 0; i < 9; i++) {
            const itemBallNode = instantiate(this.shopView.ItemBallPrefab);
            const labelcost = itemBallNode.getChildByName('Label').getComponent(Label);

            labelcost.string = this.cost[i].toString();

            const spriteBall = itemBallNode.getChildByName('Sprite').getComponent(Sprite);
            spriteBall.spriteFrame = this.shopModel.ItemTypeFrame[i];
            
            this.shopView.Container.addChild(itemBallNode);
            this.listItem.push(itemBallNode);
        }
        this.renderState();
    }

    protected async renderState(): Promise<void> {
        this.listItem.forEach((item, index) => {
            item.on(Node.EventType.TOUCH_START, async() => {
                if ( this.state[index] === 0 ) {
                    this.shop.StoreModel = index;
                    this.shopView.ChooseItemSprite.spriteFrame = this.shopModel.ItemTypeFrame[index];
                    this.shopView.ChooseItem.getComponent(UITransform).setContentSize(120, 120);
                    this.shopView.ChooseNode.active = true;
                } else {
                    await this.gameClient.user.data.getGameData().then((response) => {
                        this.scoreShop = DataUser.dataUser.data.cost;
                    })
                    .catch(async (e) => {
                        console.log(e);
                    })

                    if ( this.scoreShop >= this.cost[index] ) {
                        this.newScore = this.scoreShop - this.cost[index];
                        this.shopView.CostLabel.string = this.newScore.toString();

                        this.state[index] = 0;
                        this.cost[index] = 0;

                        item.getChildByName('Label').getComponent(Label).string = this.cost[index].toString();
                    
                        await this.gameClient.user.data.setGameData( {[this.userID]: DataUser.dataUser}, false)
                            .then((response: any) => {
                                DataUser.dataUser.data.cost = this.newScore;
                                DataUser.dataUser.data.costState = this.cost;
                                DataUser.dataUser.data.state = this.state;
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
        this.shopView.NoCost.active = false;
        this.audioControl.onAudioArray(5);
        this.interacBtnShop();
    }

    private onClickChooseCloseBtn(): void {
        this.interacBtnShop();
        this.audioControl.onAudioArray(5);
        this.shopView.ChooseNode.active = false;
    }

    private async onClickChooseBall(): Promise<void> {
        this.interacBtnShop();
        let parameters = find('GameClient');
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;

        await gameClientParams.gameClient.match.startMatch()
            .then((data) => {matchId = data.matchId})
            .catch((error) => console.log(error))
        gameClientParams.gameId = matchId;
        this.audioControl.onAudioArray(5);
        director.loadScene(SCENE_NAME.Play);
    }

    private async onClickCloseMainBtn(): Promise<void> {
        this.interacBtnShop();
        let parameters = find('GameClient');
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        await gameClientParams.gameClient.match.startMatch()
            .then((data) => {matchId = data.matchId})
            .catch((error) => console.log(error))
        gameClientParams.gameId = matchId;
        this.audioControl.onAudioArray(5);
        director.loadScene(SCENE_NAME.Play);
    }

    private interacBtnShop(): void {
        this.shopView.ChooseCloseBtn.interactable = false;
        this.shopView.NoCostCloseBtn.interactable = false;
        this.shopView.CloseMainBtn.interactable = false;
        this.shopView.LockChooseBtn.interactable = false;
        this.shopView.LockNoCostBtn.interactable = false;
    }
}

