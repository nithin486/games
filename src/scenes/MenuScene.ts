import Phaser from 'phaser';
import { ASSETS, SCENES, TOTAL_LEVELS } from '../config/constants';
import { COLORS, COLORS_STR, FONTS, GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';
import saveSystem from '../systems/SaveSystem';
import { createButton } from '../ui/Buttons';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super(SCENES.MENU);
  }

  create(): void {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x090b1a, 0x120c26, 0x081521, 0x101827, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const ambientGlow1 = this.add.graphics();
    ambientGlow1.fillStyle(0x8b5cf6, 0.30);
    ambientGlow1.fillCircle(180, 140, 280);

    const ambientGlow2 = this.add.graphics();
    ambientGlow2.fillStyle(0x22d3ee, 0.22);
    ambientGlow2.fillCircle(780, 260, 240);

    const ambientGlow3 = this.add.graphics();
    ambientGlow3.fillStyle(0xfbbf24, 0.13);
    ambientGlow3.fillCircle(GAME_WIDTH / 2, 90, 170);

    const sweep1 = this.add.graphics();
    sweep1.fillStyle(0x67e8f9, 0.06);
    sweep1.fillTriangle(0, 0, GAME_WIDTH, 0, 0, GAME_HEIGHT * 0.42);

    const sweep2 = this.add.graphics();
    sweep2.fillStyle(0x8b5cf6, 0.08);
    sweep2.fillTriangle(GAME_WIDTH, 0, GAME_WIDTH, GAME_HEIGHT, 0, GAME_HEIGHT * 0.72);

    const scanLines = this.add.graphics();
    scanLines.lineStyle(1, 0xffffff, 0.05);
    for (let y = 0; y < GAME_HEIGHT; y += 10) {
      scanLines.beginPath();
      scanLines.moveTo(0, y);
      scanLines.lineTo(GAME_WIDTH, y);
      scanLines.strokePath();
    }

    const energyRing = this.add.graphics();
    energyRing.lineStyle(2, 0x7dd3fc, 0.26);
    energyRing.strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 240);
    energyRing.lineStyle(1, 0xfbbf24, 0.18);
    energyRing.strokeCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 300);

    this.createBackgroundParticles();

    const panel = this.add.graphics();
    panel.fillStyle(0x111827, 0.78);
    panel.fillRoundedRect(GAME_WIDTH / 2 - 300, 96, 600, 390, 34);
    panel.lineStyle(2, 0x7dd3fc, 0.45);
    panel.strokeRoundedRect(GAME_WIDTH / 2 - 300, 96, 600, 390, 34);
    panel.fillStyle(0x7c3aed, 0.08);
    panel.fillRoundedRect(GAME_WIDTH / 2 - 270, 120, 540, 120, 24);

    const title = this.add.text(GAME_WIDTH / 2, 154, 'FLIP THE RULE', {
      fontFamily: FONTS.HEADING,
      fontSize: '54px',
      color: COLORS_STR.WHITE,
      stroke: COLORS_STR.PRIMARY_PURPLE,
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 0, color: '#a78bfa', blur: 18, stroke: true, fill: true },
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      y: title.y - 5,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const subtitle = this.add.text(GAME_WIDTH / 2, 206, 'GRAVITY IS JUST A SUGGESTION', {
      fontFamily: FONTS.BODY,
      fontSize: '13px',
      color: COLORS_STR.NEON_CYAN,
      letterSpacing: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#67e8f9', blur: 12, stroke: true, fill: true },
    }).setOrigin(0.5);

    const accentLine = this.add.graphics();
    accentLine.lineStyle(2, 0xfbbf24, 0.8);
    accentLine.beginPath();
    accentLine.moveTo(GAME_WIDTH / 2 - 120, 228);
    accentLine.lineTo(GAME_WIDTH / 2 + 120, 228);
    accentLine.strokePath();

    const playBtn = createButton(
      this,
      GAME_WIDTH / 2,
      298,
      270,
      62,
      '▶  PLAY',
      COLORS.PRIMARY_PURPLE,
      () => {
        const nextLevel = saveSystem.getUnlockedLevel() || 1;
        this.scene.start(SCENES.GAMEPLAY, { levelId: nextLevel });
      },
      {
        fontSize: '30px',
        radius: 16,
      }
    );

    const levelSelectBtn = createButton(
      this,
      GAME_WIDTH / 2,
      382,
      240,
      52,
      'LEVEL SELECT',
      COLORS.ACCENT_BLUE,
      () => {
        this.scene.start(SCENES.LEVEL_SELECT);
      },
      {
        fontSize: '18px',
        radius: 12,
      }
    );

    const settingsBtn = createButton(
      this,
      GAME_WIDTH / 2,
      447,
      200,
      46,
      'SETTINGS',
      0x475569,
      () => {
        this.scene.start(SCENES.SETTINGS);
      },
      {
        fontSize: '16px',
        radius: 10,
      }
    );

    // 8. Total stars counter at top right
    const totalStars = saveSystem.getTotalStars();
    const maxPossibleStars = TOTAL_LEVELS * 3;
    const starsContainer = this.add.container(GAME_WIDTH - 120, 32);
    const badge = this.add.graphics();
    badge.fillStyle(0x0f172a, 0.7);
    badge.fillRoundedRect(-34, -16, 110, 32, 16);
    badge.lineStyle(1.5, 0xfbbf24, 0.75);
    badge.strokeRoundedRect(-34, -16, 110, 32, 16);
    const starIcon = this.add.image(-12, 0, ASSETS.STAR).setScale(0.8);
    const starsText = this.add.text(10, 0, `${totalStars}/${maxPossibleStars}`, {
      fontFamily: FONTS.BODY,
      fontSize: '17px',
      color: COLORS_STR.GOLD,
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    starsContainer.add([badge, starIcon, starsText]);

    // 9. Entrance animation: fade all UI elements in
    const uiElements: any[] = [
      title,
      subtitle,
      accentLine,
      playBtn,
      levelSelectBtn,
      settingsBtn,
      starsContainer,
      panel,
      ambientGlow1,
      ambientGlow2,
      ambientGlow3,
      sweep1,
      sweep2,
      scanLines,
      energyRing,
    ];
    for (const el of uiElements) {
      el.setAlpha(0);
    }
    uiElements.forEach((el, i) => {
      this.tweens.add({
        targets: el,
        alpha: 1,
        y: (el as any).y,
        duration: 350,
        delay: i * 60,
        ease: 'Quad.easeOut',
      });
    });
  }

  private createBackgroundParticles(): void {
    const particleCount = 24;
    for (let i = 0; i < particleCount; i++) {
      const x = Phaser.Math.Between(20, GAME_WIDTH - 20);
      const y = Phaser.Math.Between(20, GAME_HEIGHT - 20);
      const isStar = i % 3 === 0;
      const key = isStar ? ASSETS.PARTICLE_STAR : ASSETS.PARTICLE;
      const p = this.add.image(x, y, key);
      p.setAlpha(Phaser.Math.FloatBetween(0.15, 0.55));
      p.setScale(Phaser.Math.FloatBetween(0.6, 1.2));
      this.tweens.add({
        targets: p,
        y: y - Phaser.Math.Between(25, 60),
        x: x + Phaser.Math.Between(-20, 20),
        alpha: Phaser.Math.FloatBetween(0.1, 0.6),
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }
}
