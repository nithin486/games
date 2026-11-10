import Phaser from 'phaser';
import { ASSETS, DEPTH } from '../config/constants';
import { MovingHazardData, MovingPlatformData } from '../config/types';
import { GAME_WIDTH, WORLD_THEMES } from '../config/gameConfig';

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
    data: MovingPlatformData,
    tint?: number
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    // Disable gravity for moving platform (Arcade body) using safe method
    if (this.body && (this.body as any).setAllowGravity) {
      (this.body as any).setAllowGravity(false);
    } else if (this.body) {
      (this.body as any).allowGravity = false;
    }
    if (this.body && (this.body as any).setImmovable) {
      (this.body as any).setImmovable(true);
    }
    this.path = data.path;
    this.speed = data.speed;
    this.pauseDuration = data.pauseDuration;
    this.setDisplaySize(data.width, data.height);
    this.setOrigin(0.5, 0.5);
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setSize(data.width, data.height);
      body.setOffset(-data.width / 2, -data.height / 2);
      body.updateFromGameObject();
    }
    if (typeof tint === 'number') {
      this.setTint(tint);
    }
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
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
      body.reset(this.x, this.y);
      body.updateFromGameObject();
    }
  }
}

/**
 * Helper factory to create moving platforms from level data.
 */
export function createMovingPlatforms(
  scene: Phaser.Scene,
  platforms: MovingPlatformData[],
  worldIndex = 0
): Phaser.Physics.Arcade.StaticGroup {
  const group = scene.physics.add.staticGroup();
  const theme = WORLD_THEMES[Math.max(0, Math.min(worldIndex, WORLD_THEMES.length - 1))] ?? WORLD_THEMES[0];

  platforms.forEach((data) => {
    const mp = new MovingPlatform(
      scene,
      data.x,
      data.y,
      'platform',
      data,
      theme.platformFill
    );
    group.add(mp);
  });
  return group;
}

export function createMovingHazards(
  scene: Phaser.Scene,
  hazards: MovingHazardData[],
  worldIndex = 0
): Phaser.Physics.Arcade.StaticGroup {
  const group = scene.physics.add.staticGroup();
  const theme = WORLD_THEMES[Math.max(0, Math.min(worldIndex, WORLD_THEMES.length - 1))] ?? WORLD_THEMES[0];

  hazards.forEach((data) => {
    const wall = new MovingPlatform(
      scene,
      data.x,
      data.y,
      ASSETS.MOVING_HAZARD,
      {
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        path: data.path,
        speed: data.speed,
      },
      theme.platformEdge ?? 0xff4d4d
    );
    wall.setDepth(DEPTH.HAZARDS);
    wall.setAlpha(0.98);
    wall.setTint(theme.platformEdge ?? 0xef4444);
    group.add(wall);
  });

  return group;
}
