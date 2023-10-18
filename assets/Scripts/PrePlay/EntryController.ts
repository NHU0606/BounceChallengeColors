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

  protected onLoad(): void {
    this.playBtn.interactable = true;
  }

  protected start(): void {
      this.ruleNode.active = false;
  }

  private onClickBtnPlay():void {
    this.audioControl.onAudioArray(5);
    this.playBtn.interactable = false;

    this.ruleNode.active = true;
  }

  private onClickOkBtn(): void {
    this.animLoad.active = true;
    director.loadScene(Constants.SCENE_NAME.Play);
  }
}
