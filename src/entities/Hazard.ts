import Phaser from 'phaser';
import { ASSETS, DEPTH } from '../config/constants';
import { HazardData } from '../config/types';

export function createHazards(
  scene: Phaser.Scene,
  hazards: HazardData[]
): Phaser.Physics.Arcade.StaticGroup {
  const group = scene.physics.add.staticGroup();

  for (const hazard of hazards) {
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
