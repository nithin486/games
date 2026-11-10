import Phaser from 'phaser';
import { ASSETS, DEPTH } from '../config/constants';
import { WORLD_THEMES } from '../config/gameConfig';
import { PlatformData } from '../config/types';

export function createPlatforms(
  scene: Phaser.Scene,
  platforms: PlatformData[],
  worldIndex: number
): Phaser.Physics.Arcade.StaticGroup {
  const group = scene.physics.add.staticGroup();
  const themeIndex = Math.max(0, Math.min(worldIndex, WORLD_THEMES.length - 1));
  const theme = WORLD_THEMES[themeIndex] ?? WORLD_THEMES[0];

  for (const p of platforms) {
    const sprite = group.create(p.x, p.y, ASSETS.PLATFORM) as Phaser.Physics.Arcade.Sprite;
    sprite.setOrigin(0, 0);
    sprite.setDisplaySize(p.width, p.height);
    sprite.refreshBody();
    sprite.setDepth(DEPTH.PLATFORMS);

    if (theme && typeof theme.platformFill === 'number') {
      sprite.setTint(theme.platformFill);
    }
  }

  return group;
}
