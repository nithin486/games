import Phaser from 'phaser';
import { ASSETS, SCENES } from '../config/constants';
import { COLORS, COLORS_STR, FONTS, GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENES.PRELOAD);
  }

  create(): void {
    // 1. Loading UI
    const titleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'FLIP THE RULE', {
      fontFamily: FONTS.HEADING,
      fontSize: '52px',
      color: COLORS_STR.WHITE,
      stroke: COLORS_STR.PRIMARY_PURPLE,
      strokeThickness: 8,
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
      // Base shadow / outer ring
      g.fillStyle(COLORS.DARK_PURPLE, 1);
      g.fillCircle(16, 16, 14);
      // Main body
      g.fillStyle(COLORS.PRIMARY_PURPLE, 1);
      g.fillCircle(16, 16, 13);
      // Gradient / specular highlight
      g.fillStyle(COLORS.LIGHT_PURPLE, 0.45);
      g.fillCircle(13, 13, 6);
      g.fillStyle(0xffffff, 0.6);
      g.fillCircle(12, 12, 2.5);

      // Eyes (white)
      g.fillStyle(0xffffff, 1);
      g.fillCircle(12, 14, 2.8);
      g.fillCircle(20, 14, 2.8);
      // Pupils
      g.fillStyle(0x1e1b4b, 1);
      g.fillCircle(13, 14, 1.4);
      g.fillCircle(21, 14, 1.4);

      // Smile
      g.lineStyle(1.8, 0xffffff, 1);
      g.beginPath();
      g.arc(16, 16, 4.5, 0.15 * Math.PI, 0.85 * Math.PI, false);
      g.strokePath();

      g.generateTexture(ASSETS.PLAYER, 32, 32);
      g.destroy();
    }

    // b) PLAYER_DEAD texture (32x32)
    if (!this.textures.exists(ASSETS.PLAYER_DEAD)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Darker / bruised body
      g.fillStyle(0x3b1d60, 1);
      g.fillCircle(16, 16, 14);
      g.fillStyle(0x581c87, 1);
      g.fillCircle(16, 16, 13);

      // X eyes
      g.lineStyle(1.8, 0xffffff, 1);
      // Left X
      g.lineBetween(10, 12, 14, 16);
      g.lineBetween(10, 16, 14, 12);
      // Right X
      g.lineBetween(18, 12, 22, 16);
      g.lineBetween(18, 16, 22, 12);

      // Frown
      g.beginPath();
      g.arc(16, 23, 4, 1.15 * Math.PI, 1.85 * Math.PI, false);
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
      g.fillStyle(COLORS.DANGER_RED, 1);
      g.beginPath();
      g.moveTo(15, 2);
      g.lineTo(28, 28);
      g.lineTo(2, 28);
      g.closePath();
      g.fillPath();

      // Outer glow / edge line
      g.lineStyle(1.8, 0xf87171, 0.9);
      g.strokePath();

      // Inner highlight
      g.lineStyle(1.2, 0xffffff, 0.5);
      g.lineBetween(15, 6, 15, 26);

      g.generateTexture(ASSETS.SPIKE_UP, 30, 30);
      g.destroy();
    }

    // e) SPIKE_DOWN texture (30x30)
    if (!this.textures.exists(ASSETS.SPIKE_DOWN)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(COLORS.DANGER_RED, 1);
      g.beginPath();
      g.moveTo(15, 28);
      g.lineTo(2, 2);
      g.lineTo(28, 2);
      g.closePath();
      g.fillPath();

      g.lineStyle(1.8, 0xf87171, 0.9);
      g.strokePath();

      g.lineStyle(1.2, 0xffffff, 0.5);
      g.lineBetween(15, 24, 15, 4);

      g.generateTexture(ASSETS.SPIKE_DOWN, 30, 30);
      g.destroy();
    }

    // f) SPIKE_LEFT texture (30x30)
    if (!this.textures.exists(ASSETS.SPIKE_LEFT)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(COLORS.DANGER_RED, 1);
      g.beginPath();
      g.moveTo(2, 15);
      g.lineTo(28, 2);
      g.lineTo(28, 28);
      g.closePath();
      g.fillPath();

      g.lineStyle(1.8, 0xf87171, 0.9);
      g.strokePath();

      g.lineStyle(1.2, 0xffffff, 0.5);
      g.lineBetween(6, 15, 26, 15);

      g.generateTexture(ASSETS.SPIKE_LEFT, 30, 30);
      g.destroy();
    }

    // f) SPIKE_RIGHT texture (30x30)
    if (!this.textures.exists(ASSETS.SPIKE_RIGHT)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(COLORS.DANGER_RED, 1);
      g.beginPath();
      g.moveTo(28, 15);
      g.lineTo(2, 28);
      g.lineTo(2, 2);
      g.closePath();
      g.fillPath();

      g.lineStyle(1.8, 0xf87171, 0.9);
      g.strokePath();

      g.lineStyle(1.2, 0xffffff, 0.5);
      g.lineBetween(24, 15, 4, 15);

      g.generateTexture(ASSETS.SPIKE_RIGHT, 30, 30);
      g.destroy();
    }

    // g) STAR texture (24x24)
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
