import Phaser from 'phaser';
import { MovingPlatformData } from '../config/types';
import { GAME_WIDTH } from '../config/gameConfig';

/**
 * MovingPlatform moves along a predefined path (linear or sinusoidal).
 * The path is an array of Vec2 points; the platform interpolates between them at the given speed.
 */
export class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
  private path: { x: number; y: number }[];
  private speed: number; // pixels per second
  private currentIdx: number = 0;
  private forward: boolean = true;
  private pauseDuration?: number;
  private pauseTimer: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    data: MovingPlatformData
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    // Disable gravity for moving platform (Arcade body) using safe method
    if (this.body && (this.body as any).setAllowGravity) {
      (this.body as any).setAllowGravity(false);
    } else if (this.body) {
      // fallback if method unavailable
      (this.body as any).allowGravity = false;
    }
    this.path = data.path;
    this.speed = data.speed;
    this.pauseDuration = data.pauseDuration;
    this.setDisplaySize(data.width, data.height);
    this.setOrigin(0.5, 0.5);
  }

  update(delta: number): void {
    if (this.pauseDuration && this.pauseTimer > 0) {
      this.pauseTimer -= delta;
      if (this.pauseTimer <= 0) {
        this.pauseTimer = 0;
      }
      return;
    }

    if (this.path.length < 2) return;
    const target = this.path[this.currentIdx];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 2) {
      // arrived at point, move to next
      if (this.forward) {
        if (this.currentIdx < this.path.length - 1) {
          this.currentIdx++;
        } else {
          this.forward = false;
          this.currentIdx--;
        }
      } else {
        if (this.currentIdx > 0) {
          this.currentIdx--;
        } else {
          this.forward = true;
          this.currentIdx++;
        }
      }
      if (this.pauseDuration) this.pauseTimer = this.pauseDuration;
      return;
    }
    const moveX = (dx / distance) * this.speed * (delta / 1000);
    const moveY = (dy / distance) * this.speed * (delta / 1000);
    this.x += moveX;
    this.y += moveY;
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).reset(this.x, this.y);
    }
  }
}

/**
 * Helper factory to create moving platforms from level data.
 */
export function createMovingPlatforms(
  scene: Phaser.Scene,
  platforms: MovingPlatformData[]
): Phaser.Physics.Arcade.StaticGroup {
  const group = scene.physics.add.staticGroup();
  platforms.forEach((data) => {
    const mp = new MovingPlatform(
      scene,
      data.x,
      data.y,
      'platform', // assumes a platform texture key exists
      data
    );
    group.add(mp);
  });
  return group;
}
