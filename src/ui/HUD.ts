import Phaser from 'phaser';
import { ASSETS, DEPTH, SCENES } from '../config/constants';
import { COLORS, COLORS_STR, FONTS, GAME_WIDTH } from '../config/gameConfig';

export class HUD {
  private container: Phaser.GameObjects.Container;
  private levelText: Phaser.GameObjects.Text;
  private challengeText: Phaser.GameObjects.Text;
  private statusText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private flipsText: Phaser.GameObjects.Text;
  private starIcon: Phaser.GameObjects.Sprite | Phaser.GameObjects.Arc;
  private pauseButton: Phaser.GameObjects.Container;
  private flipTarget: number;

  constructor(
    private scene: Phaser.Scene,
    levelId: number,
    levelName: string,
    flipTarget: number = 0
  ) {
    this.flipTarget = flipTarget;
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

    // Challenge tag
    const challengeLabel = this.getChallengeLabel(levelId);
    this.challengeText = scene.add.text(18, 46, challengeLabel, {
      fontFamily: FONTS.BODY,
      fontSize: '12px',
      color: COLORS_STR.NEON_CYAN,
      backgroundColor: '#0f172a',
      padding: { x: 8, y: 4 },
      stroke: '#000000',
      strokeThickness: 2,
    });
    this.challengeText.setAlpha(0.92);
    this.container.add(this.challengeText);

    // Flip counter (top center)
    const initialRemaining = Math.max(this.flipTarget, 0);
    this.flipsText = scene.add.text(GAME_WIDTH / 2 - 20, 16, `Flips Left: ${initialRemaining}`, {
      fontFamily: FONTS.HEADING,
      fontSize: '20px',
      color: COLORS_STR.NEON_CYAN,
      stroke: '#000000',
      strokeThickness: 3,
    });
    this.container.add(this.flipsText);

    // Status text under flips.
    this.statusText = scene.add.text(GAME_WIDTH / 2 - 18, 42, 'Route Sync', {
      fontFamily: FONTS.BODY,
      fontSize: '11px',
      color: COLORS_STR.WHITE,
      stroke: '#000000',
      strokeThickness: 2,
    });
    this.container.add(this.statusText);

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
    pauseBg.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Circle(0, 0, 22),
      hitAreaCallback: Phaser.Geom.Circle.Contains,
    });

    let isPressed = false;
    pauseBg.on('pointerdown', () => {
      isPressed = true;
      pauseBg.setFillStyle(COLORS.NEON_CYAN, 0.9);
    });
    pauseBg.on('pointerup', () => {
      if (isPressed) {
        this.scene.scene.pause();
        this.scene.scene.launch(SCENES.PAUSE, { gameScene: SCENES.GAMEPLAY });
      }
      isPressed = false;
      pauseBg.setFillStyle(COLORS.PRIMARY_PURPLE, 0.85);
    });
    pauseBg.on('pointerupoutside', () => {
      isPressed = false;
      pauseBg.setFillStyle(COLORS.PRIMARY_PURPLE, 0.85);
    });
    this.container.add(this.pauseButton);
  }

  public updateFlips(count: number): void {
    const remaining = Math.max(this.flipTarget - count, 0);
    this.flipsText.setText(`Flips Left: ${remaining}`);
  }

  public updateChallengeStatus(label: string): void {
    this.statusText.setText(label);
    this.statusText.setColor('#f8fafc');
  }

  public flashStatus(text: string, color: string): void {
    this.statusText.setText(text);
    this.statusText.setColor(color);
    this.scene.tweens.add({
      targets: this.statusText,
      scaleX: 1.18,
      scaleY: 1.18,
      duration: 180,
      yoyo: true,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.statusText.setScale(1, 1);
      },
    });
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
    this.flashStatus('BOOST X2', '#fbbf24');
    this.scene.tweens.add({
      targets: this.starIcon,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut',
    });
  }

  private getChallengeLabel(levelId: number): string {
    if (levelId <= 10) return 'Skyline Run';
    if (levelId <= 15) return 'High Risk';
    if (levelId <= 20) return 'Flow Shift';
    if (levelId <= 25) return 'Portal Rift';
    return 'Gravity Break';
  }

  public destroy(): void {
    this.container.destroy();
  }
}
