import { StoreAPI } from '../GameCenter/StoreAPI';
import {
  _decorator,
  Button,
  Component,
  director,
  find, Node
} from "cc";
import { Data } from "../DataUser";
import Constants from '../Data/Constants';
import { AudioController } from "../AudioController";
const { ccclass, property } = _decorator;

@ccclass("EntryController")
export class EntryController extends Component {
  @property({ type: AudioController })
  private audioControl: AudioController;

  @property({ type: Button })
  private playBtn: Button;

  @property({ type: Node })
  private animLoad: Node;

  @property({ type: Node })
  private ruleNode: Node;

  @property({ type: Button })
  private okBtn: Button;

  @property({ type: Button })
  private ruleBtn: Button;

  protected onLoad(): void {
    this.playBtn.interactable = true;
  }

  private onClickBtnPlay():void {
    this.audioControl.onAudioArray(5);
    this.playBtn.interactable = false;
    this.animLoad.active = true;
    director.loadScene(Constants.SCENE_NAME.Play);
  }

  private onClickOkBtn(): void {
    this.ruleNode.active = false;
  }

  private onClickRuleBtn(): void {
    this.ruleNode.active = true;
  }
}
