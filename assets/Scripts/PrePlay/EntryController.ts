import {
  _decorator,
  Button,
  Component,
  director,
  EditBox,
  find, Node
} from "cc";
import { Data } from "../DataUser";
import Constants from '../Data/Constants';
import { RequestController } from "../RequestController";
import { AudioController } from "../AudioController";
const { ccclass, property } = _decorator;

@ccclass("EntryController")
export class EntryController extends Component {
  @property({ type: AudioController })
  private audioControl: AudioController;

  @property({ type: RequestController })
  private requestController: RequestController;

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

  @property({ type: EditBox })
  private nickNameLabel: EditBox;

  @property({ type: Node })
  private warnNode: Node;

  protected onLoad(): void {
    this.playBtn.interactable = true;

    let token = JSON.parse(localStorage.getItem('token')) || undefined;
    if (token) {
      director.loadScene('Choose');
      this.requestController.get('/ranking');
    }
  }

  private async onInputSubmitted(): Promise<void> {
    const nickname = this.nickNameLabel.string;
    let formData = new FormData();
    formData.append("username", nickname);

    let res = this.requestController.post_without_header(formData, '/check_user');
    res.then(r => {
      console.log(r);

      if (r['token'] != '') {
        localStorage.setItem('token', JSON.stringify(r['token']));
        director.loadScene('Play');
      } else {
        this.warnNode.active = true;
        console.log("auth")
      }
    })
  }

  private onClickBtnPlay(): void {
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
