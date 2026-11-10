import Phaser from 'phaser';
import { ASSETS, DEPTH } from '../config/constants';
import { COLORS } from '../config/gameConfig';

export class Portal extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  private glowSprite: Phaser.GameObjects.Sprite | null = null;
  private swirlTween: Phaser.Tweens.Tween | null = null;
  private pulseTween: Phaser.Tweens.Tween | null = null;
  private isActivated: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ASSETS.PORTAL);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(DEPTH.PORTAL);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);

    // Glow effect behind portal
    this.glowSprite = scene.add.sprite(x, y, ASSETS.PORTAL);
    this.glowSprite.setScale(1.25);
    this.glowSprite.setAlpha(0.3);
    this.glowSprite.setTint(COLORS.NEON_CYAN);
    this.glowSprite.setDepth(DEPTH.PORTAL - 1);

    // Swirl animation: continuous rotation
    this.swirlTween = scene.tweens.add({
      targets: this,
      angle: 360,
      duration: 3500,
      repeat: -1,
      ease: 'Linear',
    });

    // Scale pulse: 0.9 to 1.1, yoyo
    this.pulseTween = scene.tweens.add({
      targets: [this, this.glowSprite],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  public activate(): void {
    if (this.isActivated) return;
    this.isActivated = true;

    if (this.swirlTween) this.swirlTween.stop();
    if (this.pulseTween) this.pulseTween.stop();

    if (this.glowSprite) {
      this.scene.tweens.add({
        targets: this.glowSprite,
        scaleX: 2.2,
        scaleY: 2.2,
        alpha: 0.8,
        duration: 300,
        yoyo: true,
        ease: 'Quad.easeOut',
      });
    }

    this.scene.tweens.add({
      targets: this,
      angle: '+=720',
      scaleX: 1.4,
      scaleY: 1.4,
      duration: 600,
      ease: 'Cubic.easeOut',
    });
  }

  public override destroy(fromScene?: boolean): void {
    if (this.swirlTween) {
      this.swirlTween.stop();
      this.swirlTween = null;
    }
    if (this.pulseTween) {
      this.pulseTween.stop();
      this.pulseTween = null;
    }
    if (this.glowSprite) {
      this.glowSprite.destroy();
      this.glowSprite = null;
    }
    super.destroy(fromScene);
  }
}
