import Phaser from 'phaser';
import { ASSETS, DEPTH } from '../config/constants';
import { COLORS } from '../config/gameConfig';
import { Vec2 } from '../config/types';

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  public collected: boolean = false;
  private glowSprite: Phaser.GameObjects.Sprite | null = null;
  private bobTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.STAR);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.COLLECTIBLES);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);

    // Glow effect behind the star
    this.glowSprite = scene.add.sprite(x, y, ASSETS.STAR);
    this.glowSprite.setScale(1.35);
    this.glowSprite.setAlpha(0.35);
    this.glowSprite.setTint(COLORS.GOLD);
    this.glowSprite.setDepth(DEPTH.COLLECTIBLES - 1);

    // Bob animation
    const baseY = this.y;
    this.bobTween = scene.tweens.add({
      targets: [this, this.glowSprite],
      y: baseY - 8,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  public collect(): void {
    if (this.collected) return;
    this.collected = true;

    this.body.enable = false;

    if (this.bobTween) {
      this.bobTween.stop();
      this.bobTween = null;
    }

    if (this.glowSprite) {
      this.glowSprite.destroy();
      this.glowSprite = null;
    }

    // Particle burst / celebration tween
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.8,
      scaleY: 1.8,
      alpha: 0,
      duration: 250,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.destroy();
      },
    });
  }

  public override destroy(fromScene?: boolean): void {
    if (this.bobTween) {
      this.bobTween.stop();
      this.bobTween = null;
    }
    if (this.glowSprite) {
      this.glowSprite.destroy();
      this.glowSprite = null;
    }
    super.destroy(fromScene);
  }

  public static create(scene: Phaser.Scene, data?: Vec2): Collectible | null {
    if (!data) return null;
    return new Collectible(scene, data.x, data.y);
  }
}
