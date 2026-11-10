import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { COLORS, COLORS_STR, FONTS, GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';
import saveSystem from '../systems/SaveSystem';
import { createButton } from '../ui/Buttons';

export interface PauseSceneData {
  levelId?: number;
  gameSceneKey?: string;
}

export class PauseScene extends Phaser.Scene {
  private levelId: number = 1;
  private gameSceneKey: string = SCENES.GAMEPLAY;

  constructor() {
    super(SCENES.PAUSE);
  }

  init(data?: PauseSceneData): void {
    if (data?.levelId !== undefined) {
      this.levelId = data.levelId;
    }
    if (data?.gameSceneKey) {
      this.gameSceneKey = data.gameSceneKey;
    }
  }

  create(): void {
    const overlay = this.add.graphics();
    overlay.fillStyle(0x070b18, 0.7);
    overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const glowA = this.add.graphics();
    glowA.fillStyle(0x7c3aed, 0.16);
    glowA.fillCircle(250, 150, 180);
    const glowB = this.add.graphics();
    glowB.fillStyle(0x22d3ee, 0.12);
    glowB.fillCircle(720, 320, 180);

    const panel = this.add.graphics();
    panel.fillStyle(0x111827, 0.7);
    panel.fillRoundedRect(GAME_WIDTH / 2 - 180, 70, 360, 400, 20);
    panel.lineStyle(2, 0x7dd3fc, 0.45);
    panel.strokeRoundedRect(GAME_WIDTH / 2 - 180, 70, 360, 400, 20);

    // 2. 'PAUSED' title
    this.add.text(GAME_WIDTH / 2, 120, 'PAUSED', {
      fontFamily: FONTS.HEADING,
      fontSize: '44px',
      color: COLORS_STR.WHITE,
      stroke: COLORS_STR.PRIMARY_PURPLE,
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Level indicator
    this.add.text(GAME_WIDTH / 2, 165, `Level ${this.levelId}`, {
      fontFamily: FONTS.BODY,
      fontSize: '16px',
      color: COLORS_STR.LIGHT_PURPLE,
    }).setOrigin(0.5);

    // 3. RESUME button
    const resumeBtn = createButton(
      this,
      GAME_WIDTH / 2,
      220,
      220,
      48,
      'RESUME',
      COLORS.PRIMARY_PURPLE,
      () => this.resumeGame(),
      { fontSize: '20px' }
    );

    // 4. RESTART button
    const restartBtn = createButton(
      this,
      GAME_WIDTH / 2,
      280,
      220,
      48,
      'RESTART',
      COLORS.ACCENT_BLUE,
      () => this.restartGame(),
      { fontSize: '20px' }
    );

    // 5. SOUND TOGGLE button
    let currentSettings = saveSystem.getSettings();
    let isSoundOn = currentSettings.sound;

    const soundBtn = createButton(
      this,
      GAME_WIDTH / 2,
      340,
      220,
      48,
      isSoundOn ? '🔊 SOUND: ON' : '🔇 SOUND: OFF',
      isSoundOn ? 0x2e384d : 0x475569,
      () => {
        isSoundOn = !isSoundOn;
        currentSettings = saveSystem.getSettings();
        currentSettings.sound = isSoundOn;
        saveSystem.setSettings(currentSettings);

        // Update button text
        const label = soundBtn.getByName('btn-text') as Phaser.GameObjects.Text | null;
        if (label) {
          label.setText(isSoundOn ? '🔊 SOUND: ON' : '🔇 SOUND: OFF');
        } else {
          // Fallback to first text child
          const childText = soundBtn.list.find(c => c instanceof Phaser.GameObjects.Text) as Phaser.GameObjects.Text | undefined;
          if (childText) {
            childText.setText(isSoundOn ? '🔊 SOUND: ON' : '🔇 SOUND: OFF');
          }
        }
      },
      { fontSize: '18px' }
    );

    // 6. MENU button
    const menuBtn = createButton(
      this,
      GAME_WIDTH / 2,
      405,
      220,
      44,
      'MAIN MENU',
      0x475569,
      () => this.quitToMenu(),
      { fontSize: '18px' }
    );

    // 7. Escape key listener to resume
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-ESC', () => {
        this.resumeGame();
      });
    }
  }

  private resumeGame(): void {
    this.scene.stop();
    this.scene.resume(this.gameSceneKey);
  }

  private restartGame(): void {
    this.scene.stop();
    this.scene.stop(this.gameSceneKey);
    this.scene.start(this.gameSceneKey, { levelId: this.levelId });
  }

  private quitToMenu(): void {
    this.scene.stop();
    this.scene.stop(this.gameSceneKey);
    this.scene.start(SCENES.MENU);
  }
}
