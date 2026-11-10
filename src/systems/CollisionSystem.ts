import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Collectible } from '../entities/Collectible';
import { Portal } from '../entities/Portal';
import { EVENTS } from '../config/constants';

export class CollisionSystem {
  private colliders: Phaser.Physics.Arcade.Collider[] = [];

  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    private platformGroup: Phaser.Physics.Arcade.StaticGroup,
    private hazardGroup: Phaser.Physics.Arcade.StaticGroup,
    private collectible: Collectible | null,
    private portal: Portal
  ) {}

  public setupCollisions(): void {
    // Solid platform collisions
    const platformCollider = this.scene.physics.add.collider(
      this.player,
      this.platformGroup
    );
    this.colliders.push(platformCollider);

    // Hazard overlaps (spikes)
    const hazardCollider = this.scene.physics.add.overlap(
      this.player,
      this.hazardGroup,
      this.onHazardHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.colliders.push(hazardCollider);

    // Star collectible overlap
    if (this.collectible) {
      const starCollider = this.scene.physics.add.overlap(
        this.player,
        this.collectible,
        this.onCollectStar as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        undefined,
        this
      );
      this.colliders.push(starCollider);
    }

    // Exit portal overlap
    const portalCollider = this.scene.physics.add.overlap(
      this.player,
      this.portal,
      this.onPortalReach as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.colliders.push(portalCollider);
  }

  private onHazardHit(): void {
    if (!this.player.isAlive) return;
    this.player.die();
    this.scene.events.emit(EVENTS.PLAYER_DEATH);
  }

  private onCollectStar(
    _player: Phaser.GameObjects.GameObject,
    star: Phaser.GameObjects.GameObject
  ): void {
    const collectible = star as Collectible;
    if (collectible && !collectible.collected) {
      collectible.collect();
      this.scene.events.emit(EVENTS.STAR_COLLECTED);
    }
  }

  private onPortalReach(): void {
    if (!this.player.isAlive) return;
    this.scene.events.emit(EVENTS.LEVEL_COMPLETE);
  }

  public destroy(): void {
    for (const collider of this.colliders) {
      if (collider && collider.active) {
        collider.destroy();
      }
    }
    this.colliders = [];
  }
}
