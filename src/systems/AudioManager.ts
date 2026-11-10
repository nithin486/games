import Phaser from 'phaser';
import { saveSystem } from './SaveSystem';

export class AudioManager {
  private musicEnabled: boolean = true;
  private soundEnabled: boolean = true;
  private currentMusic: Phaser.Sound.BaseSound | null = null;

  constructor(private scene: Phaser.Scene) {
    const settings = saveSystem.getSettings();
    this.musicEnabled = settings.music;
    this.soundEnabled = settings.sound;
  }

  public playSound(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
    if (!this.soundEnabled) return;
    if (!this.scene.cache.audio.exists(key)) return;

    try {
      this.scene.sound.play(key, config);
    } catch {
      // Safe no-op if audio playback is blocked or fails
    }
  }

  public playMusic(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
    if (!this.musicEnabled) return;
    if (!this.scene.cache.audio.exists(key)) return;

    try {
      if (this.currentMusic && this.currentMusic.isPlaying) {
        this.currentMusic.stop();
      }
      this.currentMusic = this.scene.sound.add(key, { loop: true, ...config });
      this.currentMusic.play();
    } catch {
      // Safe no-op
    }
  }

  public stopMusic(): void {
    try {
      if (this.currentMusic && this.currentMusic.isPlaying) {
        this.currentMusic.stop();
      }
    } catch {
      // Safe no-op
    }
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }
}
