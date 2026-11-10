import Phaser from 'phaser';
import { ASSETS, DEPTH, SCENES } from '../config/constants';
import { COLORS, COLORS_STR, FONTS, GAME_WIDTH } from '../config/gameConfig';

export class HUD {
  private container: Phaser.GameObjects.Container;
  private levelText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private flipsText: Phaser.GameObjects.Text;
  private starIcon: Phaser.GameObjects.Sprite | Phaser.GameObjects.Arc;
  private pauseButton: Phaser.GameObjects.Container;

  constructor(
    private scene: Phaser.Scene,
    levelId: number,
    levelName: string
  ) {
    this.container = scene.add.container(0, 0);
    this.container.setDepth(DEPTH.HUD);
    this.container.setScrollFactor(0);

    // Level label (top left)
    this.levelText = scene.add.text(18, 16, `${levelId}. ${levelName}`, {
      fontFamily: FONTS.HEADING,
      fontSize: '20px',
      color: COLORS_STR.WHITE,
      stroke: '#000000',
      strokeThickness: 3,
    });
    this.container.add(this.levelText);

    // Flip counter (top center)
    this.flipsText = scene.add.text(GAME_WIDTH / 2 - 20, 16, 'Flips: 0', {
      fontFamily: FONTS.HEADING,
      fontSize: '20px',
      color: COLORS_STR.NEON_CYAN,
      stroke: '#000000',
      strokeThickness: 3,
    });
    this.container.add(this.flipsText);

    // Star icon indicator (next to flips)
    if (scene.textures.exists(ASSETS.STAR)) {
      this.starIcon = scene.add.sprite(GAME_WIDTH / 2 + 75, 27, ASSETS.STAR);
      this.starIcon.setScale(0.7);
    } else {
      this.starIcon = scene.add.circle(GAME_WIDTH / 2 + 75, 27, 8, COLORS.GOLD);
    }
    this.starIcon.setAlpha(0.25);
    this.container.add(this.starIcon);

    // Time label (top right)
    this.timeText = scene.add.text(GAME_WIDTH - 140, 16, '00:00', {
      fontFamily: FONTS.HEADING,
      fontSize: '20px',
      color: COLORS_STR.WHITE,
      stroke: '#000000',
      strokeThickness: 3,
    });
    this.container.add(this.timeText);

    // Pause button (top right corner)
    this.pauseButton = scene.add.container(GAME_WIDTH - 30, 26);
    const pauseBg = scene.add.circle(0, 0, 16, COLORS.PRIMARY_PURPLE, 0.85);
    const bar1 = scene.add.rectangle(-4, 0, 3, 12, COLORS.WHITE);
    const bar2 = scene.add.rectangle(4, 0, 3, 12, COLORS.WHITE);
    this.pauseButton.add([pauseBg, bar1, bar2]);
    pauseBg.setInteractive({ useHandCursor: true });
    pauseBg.on('pointerdown', () => {
      this.scene.scene.pause();
      this.scene.scene.launch(SCENES.PAUSE, { gameScene: SCENES.GAMEPLAY });
    });
    this.container.add(this.pauseButton);
  }

  public updateFlips(count: number): void {
    this.flipsText.setText(`Flips: ${count}`);
  }

  public updateTime(seconds: number): void {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
    this.timeText.setText(formatted);
  }

  public showStarCollected(): void {
    this.starIcon.setAlpha(1);
    this.scene.tweens.add({
      targets: this.starIcon,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut',
    });
  }

  public destroy(): void {
    this.container.destroy();
  }
}
