import Phaser from 'phaser';
import { PHYSICS } from '../config/gameConfig';
import { EVENTS } from '../config/constants';
import { GravityDirection } from '../config/types';

export class GravitySystem {
  private direction: GravityDirection = 'DOWN';
  private cooldownTimer: number = 0;
  private flipCount: number = 0;
  private gravityTarget: number = PHYSICS.GRAVITY_ACCELERATION;

  constructor(private scene: Phaser.Scene) {}

  public canFlip(): boolean {
    return this.cooldownTimer <= 0;
  }

  public flip(): boolean {
    if (!this.canFlip()) return false;

    const player = (this.scene as Phaser.Scene & { player?: { body?: Phaser.Physics.Arcade.Body } }).player;
    if (player?.body) {
      player.body.blocked.down = false;
      player.body.blocked.up = false;
      player.body.touching.down = false;
      player.body.touching.up = false;
    }

    this.direction = this.direction === 'DOWN' ? 'UP' : 'DOWN';
    this.flipCount++;
    this.gravityTarget =
      this.direction === 'DOWN'
        ? PHYSICS.GRAVITY_ACCELERATION
        : -PHYSICS.GRAVITY_ACCELERATION;

    this.cooldownTimer = PHYSICS.FLIP_COOLDOWN;

    this.scene.events.emit(EVENTS.GRAVITY_FLIP, this.direction);
    this.scene.events.emit(EVENTS.FLIP_COUNT_CHANGED, this.flipCount);

    return true;
  }

  public update(delta: number): void {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer -= delta;
    }

    const currentGravity = this.scene.physics.world.gravity.y;
    const smoothing = Phaser.Math.Clamp(delta / 120, 0.18, 0.5);
    const nextGravity = Phaser.Math.Linear(currentGravity, this.gravityTarget, smoothing);
    this.scene.physics.world.gravity.y = nextGravity;

    const clampedGravity = Phaser.Math.Clamp(this.scene.physics.world.gravity.y, -PHYSICS.GRAVITY_ACCELERATION, PHYSICS.GRAVITY_ACCELERATION);
    this.scene.physics.world.gravity.y = clampedGravity;
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
    this.gravityTarget =
      this.direction === 'DOWN'
        ? PHYSICS.GRAVITY_ACCELERATION
        : -PHYSICS.GRAVITY_ACCELERATION;
    this.scene.physics.world.gravity.y = this.gravityTarget;

    this.scene.events.emit(EVENTS.FLIP_COUNT_CHANGED, this.flipCount);
  }
}
