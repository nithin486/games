import Phaser from 'phaser';
import { ASSETS, SCENES, TOTAL_LEVELS } from '../config/constants';
import { COLORS, COLORS_STR, FONTS, GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';
import { LevelData, LevelResult } from '../config/types';
import { createButton } from '../ui/Buttons';

export interface LevelCompleteData {
  result: LevelResult;
  levelData: LevelData;
}

export class LevelCompleteScene extends Phaser.Scene {
  private result!: LevelResult;
  private levelData!: LevelData;

  constructor() {
    super(SCENES.LEVEL_COMPLETE);
  }

  init(data: LevelCompleteData): void {
    this.result = data.result;
    this.levelData = data.levelData;
  }

  create(): void {
    // 1. Gradient celebration background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0f30, 0x1a0f30, 0x0a192f, 0x0a192f, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // 9. Confetti particle celebration effect
    this.createConfetti();

    // Central card panel
    const panel = this.add.graphics();
    panel.fillStyle(0x13122c, 0.9);
    panel.fillRoundedRect(GAME_WIDTH / 2 - 250, 40, 500, 460, 20);
    panel.lineStyle(2, COLORS.PRIMARY_PURPLE, 0.7);
    panel.strokeRoundedRect(GAME_WIDTH / 2 - 250, 40, 500, 460, 20);

    // 2. Celebration Title
    const title = this.add.text(GAME_WIDTH / 2, 85, 'LEVEL COMPLETE!', {
      fontFamily: FONTS.HEADING,
      fontSize: '44px',
      color: COLORS_STR.GOLD,
      stroke: '#78350f',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Subtle scale bounce on title
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 3. Level name
    const levelTitle = this.levelData?.name
      ? `Level ${this.result.levelId}: ${this.levelData.name}`
      : `Level ${this.result.levelId}`;

    this.add.text(GAME_WIDTH / 2, 130, levelTitle, {
      fontFamily: FONTS.BODY,
      fontSize: '20px',
      color: COLORS_STR.LIGHT_PURPLE,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 4. Animated Star Display
    this.createStarDisplay();

    // 5. Stats Display
    this.createStatsDisplay();

    // 6, 7, 8. Action Buttons
    this.createActionButtons();
  }

  private createStarDisplay(): void {
    const starSlotsX = [GAME_WIDTH / 2 - 70, GAME_WIDTH / 2, GAME_WIDTH / 2 + 70];
    const starSlotY = 185;
    const earnedStars = Math.max(0, Math.min(3, this.result.stars || 0));

    // Place empty / grey star silhouettes
    for (let i = 0; i < 3; i++) {
      const emptyStar = this.add.image(starSlotsX[i], starSlotY, ASSETS.STAR);
      emptyStar.setScale(1.3);
      emptyStar.setTint(0x334155);
      emptyStar.setAlpha(0.5);
    }

    // Sequentially animate earned gold stars
    for (let i = 0; i < earnedStars; i++) {
      this.time.delayedCall(350 + i * 300, () => {
        const star = this.add.image(starSlotsX[i], starSlotY, ASSETS.STAR);
        star.setScale(0);
        star.setAlpha(1);

        this.tweens.add({
          targets: star,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 350,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.burstStarParticles(starSlotsX[i], starSlotY);
          },
        });
      });
    }
  }

  private burstStarParticles(x: number, y: number): void {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const p = this.add.image(x, y, ASSETS.PARTICLE_STAR);
      p.setScale(Phaser.Math.FloatBetween(0.6, 1.0));
      p.setAlpha(1);

      const angle = (i / count) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.2, 0.2);
      const speed = Phaser.Math.Between(40, 90);

      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0.2,
        duration: 500,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  }

  private createStatsDisplay(): void {
    const statsY = 245;

    // Background for stats box
    const box = this.add.graphics();
    box.fillStyle(0x0f172a, 0.7);
    box.fillRoundedRect(GAME_WIDTH / 2 - 200, statsY, 400, 115, 12);
    box.lineStyle(1, 0x334155, 0.8);
    box.strokeRoundedRect(GAME_WIDTH / 2 - 200, statsY, 400, 115, 12);

    const timeFormatted = `${(this.result.time / 1000).toFixed(1)}s`;
    const targetTimeFormatted = this.levelData?.timeTarget ? `${this.levelData.timeTarget}s` : '-';
    const targetFlipsFormatted = this.levelData?.flipTarget ? `${this.levelData.flipTarget}` : '-';

    // Flips
    this.add.text(GAME_WIDTH / 2 - 180, statsY + 16, 'Flips:', {
      fontFamily: FONTS.BODY,
      fontSize: '17px',
      color: '#94a3b8',
    });
    this.add.text(
      GAME_WIDTH / 2 + 180,
      statsY + 16,
      `${this.result.flips} (Target: ${targetFlipsFormatted})`,
      {
        fontFamily: FONTS.BODY,
        fontSize: '17px',
        color: COLORS_STR.NEON_CYAN,
        fontStyle: 'bold',
      }
    ).setOrigin(1, 0);

    // Time
    this.add.text(GAME_WIDTH / 2 - 180, statsY + 48, 'Time:', {
      fontFamily: FONTS.BODY,
      fontSize: '17px',
      color: '#94a3b8',
    });
    this.add.text(
      GAME_WIDTH / 2 + 180,
      statsY + 48,
      `${timeFormatted} (Target: ${targetTimeFormatted})`,
      {
        fontFamily: FONTS.BODY,
        fontSize: '17px',
        color: COLORS_STR.WHITE,
        fontStyle: 'bold',
      }
    ).setOrigin(1, 0);

    // Score
    this.add.text(GAME_WIDTH / 2 - 180, statsY + 80, 'Final Score:', {
      fontFamily: FONTS.BODY,
      fontSize: '18px',
      color: '#94a3b8',
    });
    this.add.text(
      GAME_WIDTH / 2 + 180,
      statsY + 80,
      `${this.result.score}`,
      {
        fontFamily: FONTS.BODY,
        fontSize: '20px',
        color: COLORS_STR.GOLD,
        fontStyle: 'bold',
      }
    ).setOrigin(1, 0);
  }

  private createActionButtons(): void {
    const isLastLevel = this.result.levelId >= TOTAL_LEVELS;

    if (!isLastLevel) {
      // 6. NEXT LEVEL button
      createButton(
        this,
        GAME_WIDTH / 2,
        395,
        240,
        50,
        'NEXT LEVEL',
        COLORS.SUCCESS_GREEN,
        () => {
          this.scene.start(SCENES.GAMEPLAY, { levelId: this.result.levelId + 1 });
        },
        { fontSize: '22px' }
      );

      // 7. REPLAY button
      createButton(
        this,
        GAME_WIDTH / 2 - 90,
        455,
        150,
        42,
        'REPLAY',
        COLORS.ACCENT_BLUE,
        () => {
          this.scene.start(SCENES.GAMEPLAY, { levelId: this.result.levelId });
        },
        { fontSize: '18px' }
      );

      // 8. MENU button
      createButton(
        this,
        GAME_WIDTH / 2 + 90,
        455,
        150,
        42,
        'MENU',
        0x475569,
        () => {
          this.scene.start(SCENES.MENU);
        },
        { fontSize: '18px' }
      );
    } else {
      // Last Level cleared celebration!
      createButton(
        this,
        GAME_WIDTH / 2,
        395,
        260,
        50,
        'BACK TO MENU',
        COLORS.PRIMARY_PURPLE,
        () => {
          this.scene.start(SCENES.MENU);
        },
        { fontSize: '20px' }
      );

      createButton(
        this,
        GAME_WIDTH / 2,
        455,
        180,
        42,
        'REPLAY',
        COLORS.ACCENT_BLUE,
        () => {
          this.scene.start(SCENES.GAMEPLAY, { levelId: this.result.levelId });
        },
        { fontSize: '18px' }
      );
    }
  }

  private createConfetti(): void {
    const confettiColors = [
      COLORS.GOLD,
      COLORS.NEON_CYAN,
      COLORS.PRIMARY_PURPLE,
      COLORS.SUCCESS_GREEN,
      0xff6b81,
    ];

    for (let i = 0; i < 35; i++) {
      const x = Phaser.Math.Between(20, GAME_WIDTH - 20);
      const startY = Phaser.Math.Between(-80, 20);

      const color = Phaser.Utils.Array.GetRandom(confettiColors);
      const confetti = this.add.graphics();
      confetti.fillStyle(color, 0.85);
      const w = Phaser.Math.Between(5, 9);
      const h = Phaser.Math.Between(8, 14);
      confetti.fillRect(-w / 2, -h / 2, w, h);
      confetti.setPosition(x, startY);

      this.tweens.add({
        targets: confetti,
        y: GAME_HEIGHT + 30,
        x: x + Phaser.Math.Between(-40, 40),
        angle: Phaser.Math.Between(360, 1080),
        duration: Phaser.Math.Between(2500, 5000),
        delay: Phaser.Math.Between(0, 1500),
        repeat: -1,
        ease: 'Linear',
      });
    }
  }
}
