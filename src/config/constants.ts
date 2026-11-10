// ─── Scene Keys ─────────────────────────────────────────────
export const SCENES = {
  BOOT: 'BootScene',
  PRELOAD: 'PreloadScene',
  MENU: 'MenuScene',
  GAMEPLAY: 'GameplayScene',
  PAUSE: 'PauseScene',
  LEVEL_COMPLETE: 'LevelCompleteScene',
  LEVEL_SELECT: 'LevelSelectScene',
  SETTINGS: 'SettingsScene',
  GAME_OVER: 'GameOverScene',
} as const;

// ─── Asset Keys ─────────────────────────────────────────────
export const ASSETS = {
  PLAYER: 'player',
  PLAYER_DEAD: 'player-dead',
  PLATFORM: 'platform',
  SPIKE_UP: 'spike-up',
  SPIKE_DOWN: 'spike-down',
  SPIKE_LEFT: 'spike-left',
  SPIKE_RIGHT: 'spike-right',
  STAR: 'star',
  PORTAL: 'portal',
  CHECKPOINT: 'checkpoint',
  CHECKPOINT_ACTIVE: 'checkpoint-active',
  PARTICLE: 'particle',
  PARTICLE_STAR: 'particle-star',
  MOVING_PLATFORM: 'moving-platform',
  SWITCH_OFF: 'switch-off',
  SWITCH_ON: 'switch-on',
  CLOUD: 'cloud',
} as const;

// ─── Events ─────────────────────────────────────────────────
export const EVENTS = {
  GRAVITY_FLIP: 'gravity-flip',
  PLAYER_DEATH: 'player-death',
  PLAYER_LAND: 'player-land',
  STAR_COLLECTED: 'star-collected',
  LEVEL_COMPLETE: 'level-complete',
  CHECKPOINT_REACHED: 'checkpoint-reached',
  SWITCH_ACTIVATED: 'switch-activated',
  FLIP_COUNT_CHANGED: 'flip-count-changed',
} as const;

// ─── Layer Depths ───────────────────────────────────────────
export const DEPTH = {
  BACKGROUND: 0,
  CLOUDS: 10,
  PLATFORMS: 20,
  MOVING_PLATFORMS: 25,
  HAZARDS: 30,
  SWITCHES: 35,
  CHECKPOINTS: 38,
  COLLECTIBLES: 40,
  PORTAL: 50,
  PLAYER: 60,
  PARTICLES: 70,
  HUD: 100,
  TOUCH_CONTROLS: 110,
  OVERLAY: 200,
  MODAL: 300,
} as const;

// ─── Scoring ────────────────────────────────────────────────
export const SCORING = {
  LEVEL_COMPLETE: 1000,
  COLLECTIBLE_BONUS: 500,
  EFFICIENCY_MAX_BONUS: 500,
  TIME_MAX_BONUS: 250,
} as const;

// ─── Level Layout ───────────────────────────────────────────
export const TOTAL_LEVELS = 30;
export const LEVELS_PER_WORLD = [10, 5, 5, 5, 5];
export const WORLD_NAMES = [
  'Floating Islands',
  'Dangerous Heights',
  'Moving World',
  'Portal Dimension',
  'Gravity Master',
];

// ─── Save System ────────────────────────────────────────────
export const SAVE_KEY = 'flip-the-rule-save';
export const SAVE_VERSION = 1;

// ─── Misc ───────────────────────────────────────────────────
export const LEVEL_TRANSITION_DELAY = 800;
export const DEATH_RESTART_DELAY = 600;
