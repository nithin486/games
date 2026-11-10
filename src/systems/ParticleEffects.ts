import Phaser from 'phaser';
import { DEPTH } from '../config/constants';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig';
import { GravityDirection } from '../config/types';

export function gravityFlipEffect(
  scene: Phaser.Scene,
  direction: GravityDirection
): void {
  // Screen flash tint
  const flash = scene.add.graphics();
  flash.setDepth(DEPTH.OVERLAY - 1);
  flash.setScrollFactor(0);
  const flashColor = COLORS.PRIMARY_PURPLE;
  flash.fillStyle(flashColor, 0.12);
  flash.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  scene.tweens.add({
    targets: flash,
    alpha: 0,
    duration: 180,
    ease: 'Quad.easeOut',
    onComplete: () => {
      flash.destroy();
    },
  });

  // Keep the flip effect subtle and clean without drawing a harsh horizontal sweep line.
}

export function starCollectEffect(
  scene: Phaser.Scene,
  x: number,
  y: number
): void {
  const particleCount = 14;
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.3 - 0.15);
    const speed = Phaser.Math.Between(70, 160);
    const radius = Phaser.Math.Between(3, 6);
    const circle = scene.add.circle(x, y, radius, COLORS.GOLD, 0.9);
    circle.setDepth(DEPTH.PARTICLES);

    const targetX = x + Math.cos(angle) * speed;
    const targetY = y + Math.sin(angle) * speed;

    scene.tweens.add({
      targets: circle,
      x: targetX,
      y: targetY,
      scaleX: 0.1,
      scaleY: 0.1,
      alpha: 0,
      duration: Phaser.Math.Between(400, 650),
      ease: 'Quad.easeOut',
      onComplete: () => {
        circle.destroy();
      },
    });
  }
}

export function deathEffect(
  scene: Phaser.Scene,
  x: number,
  y: number
): void {
  const colors = [COLORS.PRIMARY_PURPLE, COLORS.LIGHT_PURPLE, COLORS.WHITE, COLORS.DANGER_RED];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Phaser.Math.Between(50, 180);
    const color = colors[i % colors.length];
    const size = Phaser.Math.Between(3, 8);

    const circle = scene.add.circle(x, y, size, color, 0.85);
    circle.setDepth(DEPTH.PARTICLES);

    scene.tweens.add({
      targets: circle,
      x: x + Math.cos(angle) * speed,
      y: y + Math.sin(angle) * speed,
      alpha: 0,
      scaleX: 0.2,
      scaleY: 0.2,
      duration: Phaser.Math.Between(350, 550),
      ease: 'Cubic.easeOut',
      onComplete: () => {
        circle.destroy();
      },
    });
  }
}

export function portalActivateEffect(
  scene: Phaser.Scene,
  x: number,
  y: number
): void {
  const count = 16;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const initialDist = 45;
    const pX = x + Math.cos(angle) * initialDist;
    const pY = y + Math.sin(angle) * initialDist;

    const circle = scene.add.circle(pX, pY, 4, COLORS.NEON_CYAN, 0.8);
    circle.setDepth(DEPTH.PARTICLES);

    scene.tweens.add({
      targets: circle,
      x: x,
      y: y,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 500,
      ease: 'Back.easeIn',
      onComplete: () => {
        circle.destroy();
      },
    });
  }
}

export function landingDustEffect(
  scene: Phaser.Scene,
  x: number,
  y: number,
  direction: GravityDirection
): void {
  const count = 6;
  const offsetY = direction === 'DOWN' ? 14 : -14;

  for (let i = 0; i < count; i++) {
    const sign = i % 2 === 0 ? 1 : -1;
    const dust = scene.add.circle(x, y + offsetY, Phaser.Math.Between(2, 4), COLORS.WHITE, 0.6);
    dust.setDepth(DEPTH.PARTICLES);

    const spreadX = x + sign * Phaser.Math.Between(15, 35);
    const spreadY = y + offsetY - (direction === 'DOWN' ? 4 : -4);

    scene.tweens.add({
      targets: dust,
      x: spreadX,
      y: spreadY,
      alpha: 0,
      scaleX: 0.2,
      scaleY: 0.2,
      duration: 250,
      ease: 'Quad.easeOut',
      onComplete: () => {
        dust.destroy();
      },
    });
  }
}
