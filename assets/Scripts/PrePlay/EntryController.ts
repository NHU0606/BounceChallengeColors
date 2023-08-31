import { StoreAPI } from './../StoreAPI';
import {
  _decorator,
  Button,
  Component,
  director,
  find,
} from "cc";
import { Data, SCENE_NAME } from "../Data";
import { AudioController } from "../AudioController";
const { ccclass, property } = _decorator;

@ccclass("EntryController")
export class EntryController extends Component {
  private gameClient;
  private matchId: string;

  @property({ type: AudioController })
  private audioControl: AudioController;

  @property({ type: Button })
  private playBtn: Button;

  protected onLoad(): void {
    this.playBtn.interactable = true;
  }

  protected start(): void {
    try {
      if (!localStorage.getItem(Data.highscore)) {
        localStorage.setItem(Data.highscore, "0");
      }
    } catch (error) {
      if (Data.highScoreStatic === null) Data.highScoreStatic = 0;
    }
  }

  private async onClickBtnPlay(): Promise<void> {
    this.audioControl.onAudioArray(5);
    this.playBtn.interactable = false;
    let _this = this;
    let parameters = find('GameClient');
    let gameClientParams = parameters.getComponent(StoreAPI);
    this.gameClient = gameClientParams.gameClient;

    await gameClientParams.gameClient.match.startMatch()
      .then((data) => { _this.matchId = data.matchId })
      .catch((error) => console.log(error))

    gameClientParams.gameId = _this.matchId;
    
    director.loadScene(SCENE_NAME.Play);
  }
}
