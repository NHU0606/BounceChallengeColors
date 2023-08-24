import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property({ type: AudioSource})
    private audioSource: AudioSource = null;

    @property({ type: [AudioClip]})
    private audiosClip: AudioClip[] = [];
    
    public get AudioSource() : AudioSource {
        return this.audioSource;
    }
    
    public set AudioSource(v : AudioSource) {
        this.audioSource = v;
    }
    
    public onAudio(index: number): void {
        let audioClip: AudioClip = this.audiosClip[index];
        this.audioSource.playOneShot(audioClip);
    }

    public settingAudio(number: number): void {
        this.audioSource.volume = number;
    }
}

