import Phaser from 'phaser';
import { ASSETS, SCENES } from '../config/constants';
import { COLORS, COLORS_STR, FONTS, GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENES.PRELOAD);
  }

  create(): void {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x120d26, 0x120d26, 0x081923, 0x081923, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const glow = this.add.graphics();
    glow.fillStyle(0x7c3aed, 0.2);
    glow.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 180);

    const titleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'FLIP THE RULE', {
      fontFamily: FONTS.HEADING,
      fontSize: '52px',
      color: COLORS_STR.WHITE,
      stroke: COLORS_STR.PRIMARY_PURPLE,
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 0, color: '#a78bfa', blur: 18, stroke: true, fill: true },
    }).setOrigin(0.5);

    const loadingText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, 'Loading...', {
      fontFamily: FONTS.BODY,
      fontSize: '20px',
      color: COLORS_STR.LIGHT_PURPLE,
    }).setOrigin(0.5);

    // Subtle pulsing animation on loading text
    this.tweens.add({
      targets: [titleText, loadingText],
      alpha: 0.7,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 2. Procedural Texture Generation
    this.generateTextures();

    // 3. Transition to MenuScene after brief delay
    this.time.delayedCall(500, () => {
      this.scene.start(SCENES.MENU);
    });
  }

  private generateTextures(): void {
    // a) PLAYER texture (32x32)
    if (!this.textures.exists(ASSETS.PLAYER)) {
      const g = this.make.graphics({ x: 0, y: 0 });

      // Outer glow
      g.fillStyle(0x1e1b4b, 0.9);
      g.fillCircle(16, 16, 16);

      // Main orb body with neon purple core
      g.fillStyle(0x2d106d, 1);
      g.fillCircle(16, 16, 14);
      g.fillStyle(0x7c3aed, 1);
      g.fillCircle(16, 16, 12.5);

      // Inner glow highlight
      g.fillStyle(0xa78bfa, 0.7);
      g.fillCircle(12, 11.5, 6.5);
      g.fillStyle(0xf8fafc, 0.9);
      g.fillCircle(11.8, 11.2, 2.6);

      // Shine ring
      g.lineStyle(2.2, 0x67e8f9, 0.8);
      g.strokeCircle(16, 16, 13.5);

      // Eyes
      g.fillStyle(0xf8fafc, 1);
      g.fillCircle(12.5, 15, 2.8);
      g.fillCircle(19.5, 15, 2.8);
      g.fillStyle(0x1f163a, 1);
      g.fillCircle(13, 15, 1.4);
      g.fillCircle(20, 15, 1.4);

      // Smile
      g.lineStyle(1.8, 0xffffff, 1);
      g.beginPath();
      g.arc(16, 18.5, 4.2, 0.2 * Math.PI, 0.8 * Math.PI, false);
      g.strokePath();

      g.generateTexture(ASSETS.PLAYER, 32, 32);
      g.destroy();
    }

    // b) PLAYER_DEAD texture (32x32)
    if (!this.textures.exists(ASSETS.PLAYER_DEAD)) {
      const g = this.make.graphics({ x: 0, y: 0 });

      g.fillStyle(0x1e1b4b, 0.9);
      g.fillCircle(16, 16, 16);
      g.fillStyle(0x3b1d60, 1);
      g.fillCircle(16, 16, 14);
      g.fillStyle(0x7f1d1d, 1);
      g.fillCircle(16, 16, 12.5);

      g.lineStyle(2, 0xf8fafc, 1);
      g.lineBetween(10, 11, 14, 15);
      g.lineBetween(10, 15, 14, 11);
      g.lineBetween(18, 11, 22, 15);
      g.lineBetween(18, 15, 22, 11);

      g.beginPath();
      g.arc(16, 21.5, 4.2, 1.2 * Math.PI, 1.8 * Math.PI, false);
      g.strokePath();

      g.generateTexture(ASSETS.PLAYER_DEAD, 32, 32);
      g.destroy();
    }

    // c) PLATFORM texture (64x32)
    if (!this.textures.exists(ASSETS.PLATFORM)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Main body
      g.fillStyle(COLORS.PLATFORM_GREEN, 1);
      g.fillRect(0, 0, 64, 32);

      // Top edge highlight (4px)
      g.fillStyle(COLORS.PLATFORM_EDGE, 1);
      g.fillRect(0, 0, 64, 4);

      // Subtle grass tip highlights
      g.fillStyle(0x7ec870, 0.8);
      g.fillRect(0, 0, 64, 1.5);

      // Bottom shadow (2px)
      g.fillStyle(0x283823, 1);
      g.fillRect(0, 30, 64, 2);

      // Texture dots for detail
      g.fillStyle(0x3d5436, 0.7);
      g.fillRect(8, 10, 3, 3);
      g.fillRect(24, 18, 4, 2);
      g.fillRect(42, 12, 3, 3);
      g.fillRect(52, 22, 4, 2);

      g.fillStyle(0x5f8056, 0.6);
      g.fillRect(16, 8, 3, 2);
      g.fillRect(34, 22, 3, 2);
      g.fillRect(48, 8, 4, 2);

      g.generateTexture(ASSETS.PLATFORM, 64, 32);
      g.destroy();
    }

    // d) SPIKE_UP texture (30x30)
    if (!this.textures.exists(ASSETS.SPIKE_UP)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x3f0d13, 1);
      g.fillTriangle(15, 2, 28, 28, 2, 28);
      g.fillGradientStyle(0x7f1d1d, 0x7f1d1d, 0xf87171, 0xfca5a5, 1);
      g.fillTriangle(15, 5, 25, 25, 5, 25);
      g.fillStyle(0xfff1f2, 0.68);
      g.fillTriangle(15, 8, 18, 22, 11, 22);
      g.lineStyle(2, 0xfecaca, 0.9);
      g.strokeTriangle(15, 2, 28, 28, 2, 28);
      g.lineStyle(1.2, 0xffffff, 0.55);
      g.lineBetween(15, 8, 15, 23);

      g.generateTexture(ASSETS.SPIKE_UP, 30, 30);
      g.destroy();
    }

    // e) SPIKE_DOWN texture (30x30)
    if (!this.textures.exists(ASSETS.SPIKE_DOWN)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x3f0d13, 1);
      g.fillTriangle(15, 28, 2, 2, 28, 2);
      g.fillGradientStyle(0x7f1d1d, 0x7f1d1d, 0xf87171, 0xfca5a5, 1);
      g.fillTriangle(15, 24, 5, 5, 25, 5);
      g.fillStyle(0xfff1f2, 0.68);
      g.fillTriangle(15, 21, 18, 8, 11, 8);
      g.lineStyle(2, 0xfecaca, 0.9);
      g.strokeTriangle(15, 28, 2, 2, 28, 2);
      g.lineStyle(1.2, 0xffffff, 0.55);
      g.lineBetween(15, 23, 15, 6);

      g.generateTexture(ASSETS.SPIKE_DOWN, 30, 30);
      g.destroy();
    }

    // f) SPIKE_LEFT texture (30x30)
    if (!this.textures.exists(ASSETS.SPIKE_LEFT)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x3f0d13, 1);
      g.fillTriangle(2, 15, 28, 2, 28, 28);
      g.fillGradientStyle(0x7f1d1d, 0x7f1d1d, 0xf87171, 0xfca5a5, 1);
      g.fillTriangle(5, 15, 25, 6, 25, 24);
      g.fillStyle(0xfff1f2, 0.68);
      g.fillTriangle(8, 15, 21, 18, 21, 11);
      g.lineStyle(2, 0xfecaca, 0.9);
      g.strokeTriangle(2, 15, 28, 2, 28, 28);
      g.lineStyle(1.2, 0xffffff, 0.55);
      g.lineBetween(8, 15, 22, 15);

      g.generateTexture(ASSETS.SPIKE_LEFT, 30, 30);
      g.destroy();
    }

    // g) SPIKE_RIGHT texture (30x30)
    if (!this.textures.exists(ASSETS.SPIKE_RIGHT)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x3f0d13, 1);
      g.fillTriangle(28, 15, 2, 28, 2, 2);
      g.fillGradientStyle(0x7f1d1d, 0x7f1d1d, 0xf87171, 0xfca5a5, 1);
      g.fillTriangle(25, 15, 5, 6, 5, 24);
      g.fillStyle(0xfff1f2, 0.68);
      g.fillTriangle(22, 15, 9, 18, 9, 11);
      g.lineStyle(2, 0xfecaca, 0.9);
      g.strokeTriangle(28, 15, 2, 28, 2, 2);
      g.lineStyle(1.2, 0xffffff, 0.55);
      g.lineBetween(22, 15, 8, 15);

      g.generateTexture(ASSETS.SPIKE_RIGHT, 30, 30);
      g.destroy();
    }

    // h) MOVING_HAZARD texture (64x24)
    if (!this.textures.exists(ASSETS.MOVING_HAZARD)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x3f0d13, 1);
      g.fillRoundedRect(0, 0, 64, 24, 8);
      g.fillGradientStyle(0x7f1d1d, 0x7f1d1d, 0xef4444, 0xfca5a5, 1);
      g.fillRoundedRect(2, 2, 60, 20, 6);
      g.fillStyle(0xfef2f2, 0.3);
      g.fillRoundedRect(6, 4, 52, 6, 4);
      g.lineStyle(2, 0xfecaca, 0.85);
      g.strokeRoundedRect(2, 2, 60, 20, 6);
      g.lineStyle(1.3, 0xfff7ed, 0.45);
      g.lineBetween(12, 18, 52, 18);
      g.fillStyle(0x3f0d13, 0.6);
      g.fillRoundedRect(8, 14, 48, 4, 2);

      g.generateTexture(ASSETS.MOVING_HAZARD, 64, 24);
      g.destroy();
    }

    // i) PULSE_WALL texture (160x20)
    if (!this.textures.exists(ASSETS.PULSE_WALL)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x2a0b11, 1);
      g.fillRoundedRect(0, 0, 160, 20, 8);
      g.fillGradientStyle(0x7f1d1d, 0x7f1d1d, 0xef4444, 0xfca5a5, 1);
      g.fillRoundedRect(4, 2, 152, 16, 6);
      g.fillStyle(0xfef2f2, 0.24);
      g.fillRoundedRect(12, 5, 136, 4, 2);
      g.lineStyle(2, 0xfecaca, 0.9);
      g.strokeRoundedRect(4, 2, 152, 16, 6);
      g.fillStyle(0xfff7ed, 0.8);
      g.fillRect(66, 8, 28, 2);
      g.generateTexture(ASSETS.PULSE_WALL, 160, 20);
      g.destroy();
    }

    // j) STAR texture (24x24)
    if (!this.textures.exists(ASSETS.STAR)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      const cx = 12;
      const cy = 12;
      const outerR = 10;
      const innerR = 4.8;
      const points = 5;

      g.fillStyle(COLORS.GOLD, 1);
      g.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI / points) - Math.PI / 2;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.closePath();
      g.fillPath();

      // Border glow
      g.lineStyle(1.5, 0xfffbeb, 0.9);
      g.strokePath();

      // Center bright core
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(cx, cy, 2.5);

      g.generateTexture(ASSETS.STAR, 24, 24);
      g.destroy();
    }

    // h) PORTAL texture (40x40)
    if (!this.textures.exists(ASSETS.PORTAL)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Outer rim
      g.fillStyle(0x0e7490, 0.9);
      g.fillCircle(20, 20, 19);

      // Cyan body
      g.fillStyle(COLORS.NEON_CYAN, 0.95);
      g.fillCircle(20, 20, 15);

      // Swirl arc 1
      g.lineStyle(2, 0x67e8f9, 0.8);
      g.beginPath();
      g.arc(20, 20, 11, 0, 1.4 * Math.PI, false);
      g.strokePath();

      // Swirl arc 2
      g.lineStyle(2, 0xffffff, 0.9);
      g.beginPath();
      g.arc(20, 20, 7, Math.PI, 2.3 * Math.PI, false);
      g.strokePath();

      // Bright center core
      g.fillStyle(0xffffff, 1);
      g.fillCircle(20, 20, 3.5);

      g.generateTexture(ASSETS.PORTAL, 40, 40);
      g.destroy();
    }

    // i) PARTICLE texture (8x8)
    if (!this.textures.exists(ASSETS.PARTICLE)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xffffff, 1);
      g.fillCircle(4, 4, 3.5);
      g.generateTexture(ASSETS.PARTICLE, 8, 8);
      g.destroy();
    }

    // j) PARTICLE_STAR texture (12x12)
    if (!this.textures.exists(ASSETS.PARTICLE_STAR)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      const cx = 6;
      const cy = 6;
      const outerR = 5;
      const innerR = 2.4;
      const points = 5;

      g.fillStyle(COLORS.GOLD, 1);
      g.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI / points) - Math.PI / 2;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.closePath();
      g.fillPath();

      g.generateTexture(ASSETS.PARTICLE_STAR, 12, 12);
      g.destroy();
    }

    // k) CLOUD texture (80x40)
    if (!this.textures.exists(ASSETS.CLOUD)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xffffff, 0.55);
      g.fillCircle(20, 24, 13);
      g.fillCircle(36, 17, 16);
      g.fillCircle(52, 19, 14);
      g.fillCircle(64, 24, 11);
      g.fillRect(20, 20, 44, 15);
      g.generateTexture(ASSETS.CLOUD, 80, 40);
      g.destroy();
    }

    // l) CHECKPOINT texture (24x32)
    if (!this.textures.exists(ASSETS.CHECKPOINT)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Pole
      g.fillStyle(0x94a3b8, 1);
      g.fillRect(4, 3, 3, 27);
      // Pole top cap
      g.fillStyle(0xcfd8dc, 1);
      g.fillCircle(5.5, 3, 2.5);
      // Base
      g.fillStyle(0x475569, 1);
      g.fillRect(2, 28, 7, 3);
      // Flag (inactive blue)
      g.fillStyle(COLORS.ACCENT_BLUE, 1);
      g.beginPath();
      g.moveTo(7, 4);
      g.lineTo(21, 10);
      g.lineTo(7, 16);
      g.closePath();
      g.fillPath();
      g.lineStyle(1, 0x60a5fa, 0.8);
      g.strokePath();

      g.generateTexture(ASSETS.CHECKPOINT, 24, 32);
      g.destroy();
    }

    // m) CHECKPOINT_ACTIVE texture (24x32)
    if (!this.textures.exists(ASSETS.CHECKPOINT_ACTIVE)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Pole
      g.fillStyle(0xe2e8f0, 1);
      g.fillRect(4, 3, 3, 27);
      // Pole top cap
      g.fillStyle(COLORS.GOLD, 1);
      g.fillCircle(5.5, 3, 2.5);
      // Base
      g.fillStyle(0x64748b, 1);
      g.fillRect(2, 28, 7, 3);
      // Flag (active green)
      g.fillStyle(COLORS.SUCCESS_GREEN, 1);
      g.beginPath();
      g.moveTo(7, 4);
      g.lineTo(21, 10);
      g.lineTo(7, 16);
      g.closePath();
      g.fillPath();
      g.lineStyle(1, 0x86efac, 0.9);
      g.strokePath();

      g.generateTexture(ASSETS.CHECKPOINT_ACTIVE, 24, 32);
      g.destroy();
    }

    // n) MOVING_PLATFORM texture (64x24)
    if (!this.textures.exists(ASSETS.MOVING_PLATFORM)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0x1e293b, 1);
      g.fillRect(0, 0, 64, 24);
      // Cyan top indicator
      g.fillStyle(COLORS.NEON_CYAN, 1);
      g.fillRect(0, 0, 64, 3);
      g.lineStyle(1.5, COLORS.NEON_CYAN, 0.8);
      g.strokeRect(0, 0, 64, 24);

      // Center decorative line
      g.lineStyle(1, 0x38bdf8, 0.4);
      g.lineBetween(12, 12, 52, 12);

      g.generateTexture(ASSETS.MOVING_PLATFORM, 64, 24);
      g.destroy();
    }

    // o) SWITCH_OFF texture (24x24)
    if (!this.textures.exists(ASSETS.SWITCH_OFF)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Base
      g.fillStyle(0x334155, 1);
      g.fillRect(2, 16, 20, 6);
      // Red button (up)
      g.fillStyle(COLORS.DANGER_RED, 1);
      g.fillRect(6, 6, 12, 10);
      g.lineStyle(1, 0xf87171, 1);
      g.strokeRect(6, 6, 12, 10);

      g.generateTexture(ASSETS.SWITCH_OFF, 24, 24);
      g.destroy();
    }

    // p) SWITCH_ON texture (24x24)
    if (!this.textures.exists(ASSETS.SWITCH_ON)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Base
      g.fillStyle(0x334155, 1);
      g.fillRect(2, 16, 20, 6);
      // Green button (pressed down)
      g.fillStyle(COLORS.SUCCESS_GREEN, 1);
      g.fillRect(6, 11, 12, 5);
      g.lineStyle(1, 0x86efac, 1);
      g.strokeRect(6, 11, 12, 5);

      g.generateTexture(ASSETS.SWITCH_ON, 24, 24);
      g.destroy();
    }
  }
}
