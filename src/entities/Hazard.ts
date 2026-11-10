import Phaser from 'phaser';
import { ASSETS, DEPTH } from '../config/constants';
import { HazardData } from '../config/types';

export function createHazards(
  scene: Phaser.Scene,
  hazards: HazardData[]
): Phaser.Physics.Arcade.StaticGroup {
  const group = scene.physics.add.staticGroup();

  for (const hazard of hazards) {
    if (hazard.type === 'pulse') {
      const sprite = group.create(
        hazard.x,
        hazard.y,
        ASSETS.PULSE_WALL
      ) as Phaser.Physics.Arcade.Sprite;
      sprite.setDepth(DEPTH.HAZARDS);
      sprite.setDisplaySize(hazard.width ?? 110, hazard.height ?? 18);
      sprite.setOrigin(0.5, 0.5);
      sprite.setAlpha(0.7);
      sprite.refreshBody();

      scene.tweens.add({
        targets: sprite,
        alpha: { from: 0.35, to: 1 },
        scaleX: { from: 0.96, to: 1.05 },
        duration: hazard.activeTime ?? 700,
        hold: hazard.inactiveTime ?? 400,
        yoyo: true,
        repeat: -1,
        delay: hazard.phase ?? 0,
        ease: 'Sine.easeInOut',
      });
      continue;
    }

    if (hazard.type !== 'spike') continue;

    let key: string;
    switch (hazard.direction) {
      case 'down':
        key = ASSETS.SPIKE_DOWN;
        break;
      case 'left':
        key = ASSETS.SPIKE_LEFT;
        break;
      case 'right':
        key = ASSETS.SPIKE_RIGHT;
        break;
      case 'up':
      default:
        key = ASSETS.SPIKE_UP;
        break;
    }

    const sprite = group.create(hazard.x, hazard.y, key) as Phaser.Physics.Arcade.Sprite;
    sprite.setDepth(DEPTH.HAZARDS);
    sprite.refreshBody();
  }

  return group;
}
