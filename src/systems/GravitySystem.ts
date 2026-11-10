import Phaser from 'phaser';
import { PHYSICS } from '../config/gameConfig';
import { EVENTS } from '../config/constants';
import { GravityDirection } from '../config/types';

export class GravitySystem {
  private direction: GravityDirection = 'DOWN';
  private cooldownTimer: number = 0;
  private flipCount: number = 0;

  constructor(private scene: Phaser.Scene) {}

  public canFlip(): boolean {
    return this.cooldownTimer <= 0;
  }

  public flip(): boolean {
    if (!this.canFlip()) return false;

    this.direction = this.direction === 'DOWN' ? 'UP' : 'DOWN';
    this.flipCount++;

    const gravityY =
      this.direction === 'DOWN'
        ? PHYSICS.GRAVITY_ACCELERATION
        : -PHYSICS.GRAVITY_ACCELERATION;
    this.scene.physics.world.gravity.y = gravityY;

    this.cooldownTimer = PHYSICS.FLIP_COOLDOWN;

    this.scene.events.emit(EVENTS.GRAVITY_FLIP, this.direction);
    this.scene.events.emit(EVENTS.FLIP_COUNT_CHANGED, this.flipCount);

    return true;
  }

  public update(delta: number): void {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= delta;
    }
  }

  public getDirection(): GravityDirection {
    return this.direction;
  }

  public getFlipCount(): number {
    return this.flipCount;
  }

  public reset(initialDirection: GravityDirection = 'DOWN'): void {
    this.direction = initialDirection;
    this.cooldownTimer = 0;
    this.flipCount = 0;

    const gravityY =
      this.direction === 'DOWN'
        ? PHYSICS.GRAVITY_ACCELERATION
        : -PHYSICS.GRAVITY_ACCELERATION;
    this.scene.physics.world.gravity.y = gravityY;

    this.scene.events.emit(EVENTS.FLIP_COUNT_CHANGED, this.flipCount);
  }
}
