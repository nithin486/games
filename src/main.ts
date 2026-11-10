import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './config/gameConfig';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuScene } from './scenes/MenuScene';
import { GameplayScene } from './scenes/GameplayScene';
import { PauseScene } from './scenes/PauseScene';
import { LevelCompleteScene } from './scenes/LevelCompleteScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { SettingsScene } from './scenes/SettingsScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#0B0B1A',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 1000 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    GameplayScene,
    PauseScene,
    LevelCompleteScene,
    LevelSelectScene,
    SettingsScene,
  ],
  render: {
    pixelArt: false,
    antialias: true,
  },
  input: {
    activePointers: 3,
  },
};

const game = new Phaser.Game(config);

// Handle HMR cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    game.destroy(true);
  });
}
