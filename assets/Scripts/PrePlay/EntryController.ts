import {
  _decorator,
  AudioClip,
  AudioSource,
  Button,
  Component,
  director,
  Node,
  sys,
} from "cc";
import { Data, SCENE_NAME } from "../Data";
import { AudioController } from "../AudioController";
const { ccclass, property } = _decorator;

@ccclass("EntryController")
export class EntryController extends Component {
  @property({ type: AudioController })
  private audioControl: AudioController;

  @property({ type: Button })
  private playBtn: Button;

  protected start(): void {
    try {
      if (!localStorage.getItem(Data.highscore)) {
        localStorage.setItem(Data.highscore, "0");
      }
    } catch (error) {
      if (Data.highScoreStatic === null) Data.highScoreStatic = 0;
    }
  }

  private onClickBtnPlay(): void {
    this.audioControl.onAudioArray(5);
    director.loadScene(SCENE_NAME.Play);
  }

  private onClickShopBtn(): void {
    this.audioControl.onAudioArray(5);
    director.loadScene(SCENE_NAME.Shop);
}
}
