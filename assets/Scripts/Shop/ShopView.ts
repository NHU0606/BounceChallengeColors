import { _decorator, Button, Component, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopView')
export class ShopView extends Component {
   @property({ type: Prefab })
   private itemBallPrefab: Prefab;
   
   public get ItemBallPrefab() : Prefab {
    return this.itemBallPrefab;
   }
   
    @property({ type: Node })
    private container: Node;

    
    public get Container() : Node {
        return this.container;
    }

    @property({ type: Label })
    private costLabel: Label;
    
    public get CostLabel() : Label {
        return this.costLabel;
    }
    
    @property({ type: Node })
    private chooseNode: Node;
    
    public get ChooseNode() : Node {
        return this.chooseNode;
    }

    @property({ type: Node })
    private chooseItem: Node;
    
    public get ChooseItem() : Node {
        return this.chooseItem;
    }
    
    @property({ type: Sprite })
    private chooseItemSprite: Sprite;
    
    public get ChooseItemSprite() : Sprite {
        return this.chooseItemSprite;
    }
    
    @property({ type: Node })
    private noCost: Node;
    
    public get NoCost() : Node {
        return this.noCost;
    }

    @property({ type: Button })
    private chooseCloseBtn: Button;
    
    public get ChooseCloseBtn() : Button {
        return this.chooseCloseBtn;
    }

    @property({ type: Button })
    private noCostCloseBtn: Button;
    
    public get NoCostCloseBtn() : Button {
        return this.noCostCloseBtn;
    }
    
    @property({ type: Button })
    private closeMainBtn: Button;
    
    public get CloseMainBtn() : Button {
        return this.closeMainBtn;
    }
    
    @property({ type: Button })
    private lockChooseBtn: Button;
    
    public get LockChooseBtn() : Button {
        return this.lockChooseBtn;
    }

    @property({ type: Button })
    private lockNoCostBtn: Button;
    
    public get LockNoCostBtn() : Button {
        return this.lockNoCostBtn;
    }
}

