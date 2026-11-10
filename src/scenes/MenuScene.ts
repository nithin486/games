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
    // 1. Gradient Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1e1035, 0x1e1035, 0x091428, 0x091428, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // 2. Floating background particles / stars
    this.createBackgroundParticles();

    // 3. Title with floating animation
    const title = this.add.text(GAME_WIDTH / 2, 95, 'FLIP THE RULE', {
      fontFamily: FONTS.HEADING,
      fontSize: '52px',
      color: COLORS_STR.WHITE,
      stroke: COLORS_STR.PRIMARY_PURPLE,
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      y: title.y - 6,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Subtitle tagline
    const subtitle = this.add.text(GAME_WIDTH / 2, 140, 'GRAVITY IS JUST A SUGGESTION', {
      fontFamily: FONTS.BODY,
      fontSize: '14px',
      color: COLORS_STR.NEON_CYAN,
      letterSpacing: 4,
    }).setOrigin(0.5);

    // 4. Bobbing player character
    const player = this.add.image(GAME_WIDTH / 2, 195, ASSETS.PLAYER);
    player.setScale(1.6);
    this.tweens.add({
      targets: player,
      y: player.y + 8,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Quad.easeInOut',
    });

    // 5. PLAY button - NOT added to any parent container
    const playBtn = createButton(
      this,
      GAME_WIDTH / 2,
      280,
      240,
      56,
      '▶  PLAY',
      COLORS.PRIMARY_PURPLE,
      () => {
        const nextLevel = saveSystem.getUnlockedLevel() || 1;
        this.scene.start(SCENES.GAMEPLAY, { levelId: nextLevel });
      },
      {
        fontSize: '28px',
        radius: 14,
      }
    );

    // 6. LEVEL SELECT button
    const levelSelectBtn = createButton(
      this,
      GAME_WIDTH / 2,
      355,
      240,
      48,
      'LEVEL SELECT',
      COLORS.ACCENT_BLUE,
      () => {
        this.scene.start(SCENES.LEVEL_SELECT);
      },
      {
        fontSize: '20px',
        radius: 12,
      }
    );

    // 7. SETTINGS button
    const settingsBtn = createButton(
      this,
      GAME_WIDTH / 2,
      425,
      180,
      42,
      '⚙  SETTINGS',
      0x475569,
      () => {
        this.scene.start(SCENES.SETTINGS);
      },
      {
        fontSize: '18px',
        radius: 10,
      }
    );

    // 8. Total stars counter at top right
    const totalStars = saveSystem.getTotalStars();
    const maxPossibleStars = TOTAL_LEVELS * 3;
    const starsContainer = this.add.container(GAME_WIDTH - 120, 32);
    const starIcon = this.add.image(-20, 0, ASSETS.STAR).setScale(0.9);
    const starsText = this.add.text(6, 0, `${totalStars}/${maxPossibleStars}`, {
      fontFamily: FONTS.BODY,
      fontSize: '18px',
      color: COLORS_STR.GOLD,
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    starsContainer.add([starIcon, starsText]);

    // 9. Entrance animation: fade all UI elements in
    const uiElements = [title, subtitle, player, playBtn, levelSelectBtn, settingsBtn, starsContainer];
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
