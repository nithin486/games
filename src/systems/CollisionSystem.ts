import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Collectible } from '../entities/Collectible';
import { Portal } from '../entities/Portal';
import { EVENTS } from '../config/constants';
import { PortalPairData } from '../config/types';

export class CollisionSystem {
  private colliders: Phaser.Physics.Arcade.Collider[] = [];
  private portalPairs: Portal[] = [];
  private lastTeleportAt = 0;

  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    private platformGroup: Phaser.Physics.Arcade.StaticGroup,
    private hazardGroup: Phaser.Physics.Arcade.StaticGroup,
    private collectible: Collectible | null,
    private portal: Portal,
    private movingPlatformGroup?: Phaser.Physics.Arcade.StaticGroup,
    private movingWallGroup?: Phaser.Physics.Arcade.StaticGroup,
    private portalPairsData: PortalPairData[] = []
  ) {}

  public setupCollisions(): void {
    // Solid platform collisions
    const platformCollider = this.scene.physics.add.collider(
      this.player,
      this.platformGroup
    );
    this.colliders.push(platformCollider);

    if (this.movingPlatformGroup) {
      const movingPlatformCollider = this.scene.physics.add.collider(
        this.player,
        this.movingPlatformGroup
      );
      this.colliders.push(movingPlatformCollider);
    }

    if (this.movingWallGroup) {
      const movingWallCollider = this.scene.physics.add.collider(
        this.player,
        this.movingWallGroup
      );
      this.colliders.push(movingWallCollider);
    }

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

    // Portal pair teleporters
    for (const pair of this.portalPairsData) {
      const a = new Portal(this.scene, pair.a.x, pair.a.y);
      const b = new Portal(this.scene, pair.b.x, pair.b.y);
      this.portalPairs.push(a, b);

      const aCollider = this.scene.physics.add.overlap(
        this.player,
        a,
        () => this.onPortalTeleport(a, b),
        undefined,
        this
      );
      const bCollider = this.scene.physics.add.overlap(
        this.player,
        b,
        () => this.onPortalTeleport(b, a),
        undefined,
        this
      );
      this.colliders.push(aCollider, bCollider);
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

  private onPortalTeleport(from: Portal, to: Portal): void {
    if (!this.player.isAlive) return;
    const now = this.scene.time.now;
    if (now - this.lastTeleportAt < 450) return;

    this.lastTeleportAt = now;
    this.player.setPosition(to.x, to.y);
    this.player.body.setVelocity(0, 0);
    this.player.body.setAcceleration(0, 0);
    from.activate();
    to.activate();
  }

  public destroy(): void {
    for (const collider of this.colliders) {
      if (collider && collider.active) {
        collider.destroy();
      }
    }
    for (const portal of this.portalPairs) {
      portal.destroy();
    }
    this.colliders = [];
    this.portalPairs = [];
  }
}
