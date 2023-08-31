import { _decorator, AudioClip, AudioSource, Component, Node, Sprite, sys } from 'cc';
import { Data } from './Data';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    private isIconShown: boolean = false;
  private isMuted: boolean = false;
  private variableVolumeArray: number[] = [];
  private variableVolume: number;
  private convertVolume: number;

  @property(AudioSource)
  public audioBackground: AudioSource = null;

  @property({ type: AudioSource })
  private soundMachine: AudioSource;

  @property({ type: [AudioClip] })
  private arrayAudio: AudioClip[] = [];

  @property({ type: Sprite })
  private iconToShow: Sprite = null;

  @property({ type: Sprite })
  private iconToHide: Sprite = null;

  protected start(): void {
    this.iconToShow.node.active = true;
    this.iconToHide.node.active = false;

    try {
      var getVolumne = sys.localStorage.getItem(Data.sound);

      if (getVolumne) {
        this.variableVolumeArray = JSON.parse(getVolumne);
        localStorage.setItem(
          Data.sound,
          JSON.stringify(this.variableVolumeArray)
        );
        this.convertVolume =
          this.variableVolumeArray[this.variableVolumeArray.length - 1];

        if (this.convertVolume === 1) {
          this.onAudio();
        } else if (this.convertVolume === 0) {
          this.offAudio();
        }
      } else {
        if (Data.soundStatic === 1) {
          this.onAudio();
        } else if (Data.soundStatic === 0) {
          this.offAudio();
        }
      }
    } catch (error) {
      if (Data.soundStatic === 1) {
        this.onAudio();
      } else if (Data.soundStatic === 0) {
        this.offAudio();
      }
    }
  }

  public onAudioArray(index: number): void {
    let clip: AudioClip = this.arrayAudio[index];
    this.soundMachine.playOneShot(clip);
  }

  protected onAudio(): void {
    this.iconToShow.node.active = true;
    this.iconToHide.node.active = false;
    this.variableVolume = 1;
    this.audioBackground.play();
    this.variableVolumeArray.push(this.variableVolume);

    try {
      sys.localStorage.setItem(
        Data.sound,
        JSON.stringify(this.variableVolumeArray)
      );
      Data.soundStatic = 1;
    } catch (error) {
      Data.soundStatic = 1;
    }
    this.soundMachine.volume = 1;

    this.audioBackground.volume = 1;
  }

  protected offAudio(): void {
    this.iconToShow.node.active = false;
    this.iconToHide.node.active = true;

    this.variableVolume = 0;
    this.audioBackground.pause();
    this.variableVolumeArray.push(this.variableVolume);

    try {
      sys.localStorage.setItem(
        Data.sound,
        JSON.stringify(this.variableVolumeArray)
      );
      Data.soundStatic = 0;
    } catch (error) {
      Data.soundStatic = 0;
    }
    this.soundMachine.volume = 0;

    this.audioBackground.volume = 0;
  }

  public onClickIcon() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      Data.soundStatic = 0;
      this.audioBackground.volume = 0;
    } else {
      Data.soundStatic = 1;
      this.audioBackground.volume = 1;
    }
  }

  public onToggleButtonClicked() {
    this.isIconShown = !this.isIconShown;
    this.updateIconsVisibility();
  }

  public updateIconsVisibility() {
    this.iconToShow.node.active = this.isIconShown;
    this.iconToHide.node.active = !this.isIconShown;
  }
}
