import { _decorator, AudioClip, AudioSource, Button, Component, Node, Sprite, SpriteFrame } from 'cc';
import { AudioType } from './Data/Constants';
import { Data } from './DataUser';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property({ type: AudioSource })
    private audioSource: AudioSource;

    @property({ type: Button })
    private buttonSound: Button;

    @property({ type: Sprite })
    private spriteSound: Sprite;

    @property({ type: SpriteFrame })
    private frameSoundOn: SpriteFrame;

    @property({ type: SpriteFrame })
    private frameSoundOff: SpriteFrame;

    @property({ type: AudioClip })
    private listAudioClip: AudioClip[] = [];

    @property({ type: Button })
    private listButton: Button[] = [];

    protected onLoad(): void {
        this.buttonSound?.node.on(Button.EventType.CLICK, () => {
          Data.gameVolume = Data.gameVolume ? 0 : 1,
            this.updateSound();
        })
    }

    protected start(): void {
        this.updateSound();
        this.listButton.map((button) => {
            button.node.on(Button.EventType.CLICK, () => {
                this.playSound(AudioType.ClickBtn)
            })
        })
    }

    public turnOffBtnSound(): void {
        this.buttonSound.interactable = false;
    }

    public playSound(type: AudioType): void {
        this.audioSource.playOneShot(this.listAudioClip[type], Data.gameVolume);
    }

    public updateSound(): void {
        if ( Data.gameVolume === 0 ) { 
            this.audioSource.stop();
            this.spriteSound && (this.spriteSound.spriteFrame = this.frameSoundOff);
        } else {
            this.audioSource.play();
            this.spriteSound && (this.spriteSound.spriteFrame = this.frameSoundOn);
        }
    }
}


