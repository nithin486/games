import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig';

export interface SafeAreaMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Returns uniform scaling factor based on current scene or game dimensions.
 */
export function getScale(scene: Phaser.Scene): number {
  const width = scene.scale?.width ?? GAME_WIDTH;
  const height = scene.scale?.height ?? GAME_HEIGHT;
  return Math.min(width / GAME_WIDTH, height / GAME_HEIGHT);
}

/**
 * Returns horizontal center coordinate for standard game canvas.
 */
export function centerX(_scene?: Phaser.Scene): number {
  return GAME_WIDTH / 2;
}

/**
 * Returns vertical center coordinate for standard game canvas.
 */
export function centerY(_scene?: Phaser.Scene): number {
  return GAME_HEIGHT / 2;
}

/**
 * Checks whether the current environment is mobile / touch-first.
 */
export function isMobile(scene: Phaser.Scene): boolean {
  const hasTouch = Boolean(scene.sys.game.device.input.touch);
  const smallScreen = typeof window !== 'undefined' ? window.innerWidth < 768 : true;
  return hasTouch && smallScreen;
}

/**
 * Returns safe area margins for mobile notches / rounded screen corners.
 */
export function getSafeArea(): SafeAreaMargins {
  return {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  };
}
