import Phaser from 'phaser';
import { PHYSICS, PLAYER_CONFIG } from '../config/gameConfig';
import { ASSETS, DEPTH, EVENTS } from '../config/constants';
import { GravityDirection } from '../config/types';

export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  public isAlive: boolean = true;
  public isGrounded: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.PLAYER);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.PLAYER);
    this.body.setCircle(PLAYER_CONFIG.RADIUS, 2, 2);
    this.body.setBounce(PLAYER_CONFIG.BOUNCE, PLAYER_CONFIG.BOUNCE);
    this.body.setMaxVelocity(PHYSICS.MAX_HORIZONTAL_SPEED, PHYSICS.MAX_VERTICAL_SPEED);
    this.body.setDragX(PHYSICS.HORIZONTAL_FRICTION);
  }

  public moveLeft(): void {
    if (!this.isAlive) return;
    this.body.setAccelerationX(-PHYSICS.HORIZONTAL_ACCELERATION);
    this.setFlipX(true);
  }

  public moveRight(): void {
    if (!this.isAlive) return;
    this.body.setAccelerationX(PHYSICS.HORIZONTAL_ACCELERATION);
    this.setFlipX(false);
  }

  public stopMoving(): void {
    this.body.setAccelerationX(0);
  }

  public onGravityFlip(direction: GravityDirection): void {
    if (!this.isAlive) return;
    this.setFlipY(direction === 'UP');

    this.scene.tweens.killTweensOf(this);
    this.setScale(1.3, 0.7);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      ease: 'Back.easeOut',
    });
  }

  public die(): void {
    if (!this.isAlive) return;
    this.isAlive = false;
    this.body.setVelocity(0, 0);
    this.body.setAcceleration(0, 0);
    this.body.enable = false;

    if (this.scene.textures.exists(ASSETS.PLAYER_DEAD)) {
      this.setTexture(ASSETS.PLAYER_DEAD);
    }

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0.1,
      scaleY: 0.1,
      duration: 300,
      ease: 'Back.easeIn',
    });
  }

  public respawn(x: number, y: number, gravityDir: GravityDirection = 'DOWN'): void {
    this.setPosition(x, y);
    this.body.enable = true;
    this.body.setVelocity(0, 0);
    this.body.setAcceleration(0, 0);
    this.setAlpha(1);
    this.setScale(1, 1);
    this.setTexture(ASSETS.PLAYER);
    this.isAlive = true;
    this.setFlipY(gravityDir === 'UP');
  }

  public update(): void {
    if (!this.isAlive) return;

    // Check for out‑of‑bounds death (top or bottom edge)
    const worldH = this.scene.physics.world.bounds.height;
    if (this.y < -20 || this.y > worldH + 20) {
      this.die();
      this.scene.events.emit(EVENTS.PLAYER_DEATH);
      return;
    }

    // Clamp horizontal position to world bounds
    const worldBounds = this.scene.physics.world.bounds;
    if (this.x < worldBounds.x + PLAYER_CONFIG.RADIUS) {
      this.x = worldBounds.x + PLAYER_CONFIG.RADIUS;
      this.body.setVelocityX(0);
    }
    if (this.x > worldBounds.right - PLAYER_CONFIG.RADIUS) {
      this.x = worldBounds.right - PLAYER_CONFIG.RADIUS;
      this.body.setVelocityX(0);
    }

    this.isGrounded =
      this.body.blocked.down ||
      this.body.blocked.up ||
      this.body.touching.down ||
      this.body.touching.up;
  }
}
