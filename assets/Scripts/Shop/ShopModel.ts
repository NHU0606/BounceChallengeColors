import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShopModel')
export class ShopModel extends Component {
   @property({ type: [SpriteFrame]})
   private itemTypeFrame: SpriteFrame[] = [];
   
   public get ItemTypeFrame() : SpriteFrame[] {
    return this.itemTypeFrame;
   }

   
   public set ItemTypeFrame(v : SpriteFrame[]) {
    this.itemTypeFrame = v;
   }
   
}

