// ─── Physics Tuning ─────────────────────────────────────────
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;

export const PHYSICS = {
  HORIZONTAL_ACCELERATION: 900,
  MAX_HORIZONTAL_SPEED: 260,
  HORIZONTAL_FRICTION: 1200,
  GRAVITY_ACCELERATION: 1000,
  MAX_VERTICAL_SPEED: 650,
  FLIP_COOLDOWN: 200,
} as const;

export const PLAYER_CONFIG = {
  RADIUS: 14,
  SPRITE_SIZE: 32,
  BOUNCE: 0,
} as const;

// ─── Color Palette ──────────────────────────────────────────
export const COLORS = {
  PRIMARY_PURPLE: 0x7c3aed,
  ACCENT_BLUE: 0x3b82f6,
  NEON_CYAN: 0x06b6d4,
  GOLD: 0xfbbf24,
  SUCCESS_GREEN: 0x22c55e,
  DANGER_RED: 0xef4444,
  DARK_BG: 0x0b0b1a,
  WHITE: 0xffffff,
  LIGHT_PURPLE: 0xa78bfa,
  DARK_PURPLE: 0x4c1d95,
  PLATFORM_GREEN: 0x4a6741,
  PLATFORM_EDGE: 0x6b8f63,
} as const;

export const COLORS_STR = {
  PRIMARY_PURPLE: '#7C3AED',
  ACCENT_BLUE: '#3B82F6',
  NEON_CYAN: '#06B6D4',
  GOLD: '#FBBF24',
  SUCCESS_GREEN: '#22C55E',
  DANGER_RED: '#EF4444',
  DARK_BG: '#0B0B1A',
  WHITE: '#FFFFFF',
  LIGHT_PURPLE: '#A78BFA',
} as const;

// ─── World Visual Themes ────────────────────────────────────
export const WORLD_THEMES = [
  {
    name: 'Floating Islands',
    skyTop: 0x0f0c29,
    skyBottom: 0x302b63,
    platformFill: 0x4a6741,
    platformEdge: 0x6b8f63,
    platformTop: 0x7ec870,
    accent: 0x7c3aed,
  },
  {
    name: 'Dangerous Heights',
    skyTop: 0x1a0a2e,
    skyBottom: 0x4a1942,
    platformFill: 0x5c4033,
    platformEdge: 0x8b6914,
    platformTop: 0xc49a3c,
    accent: 0xef4444,
  },
  {
    name: 'Moving World',
    skyTop: 0x0a2647,
    skyBottom: 0x144272,
    platformFill: 0x2c5364,
    platformEdge: 0x0f4c75,
    platformTop: 0x48a9c5,
    accent: 0x3b82f6,
  },
  {
    name: 'Portal Dimension',
    skyTop: 0x1a0a2e,
    skyBottom: 0x2d1b69,
    platformFill: 0x4a2c8a,
    platformEdge: 0x6c3ec4,
    platformTop: 0x9f7aea,
    accent: 0x06b6d4,
  },
  {
    name: 'Gravity Master',
    skyTop: 0x0b0b1a,
    skyBottom: 0x1a1a3e,
    platformFill: 0x3d3d5c,
    platformEdge: 0x5a5a8a,
    platformTop: 0x8888b8,
    accent: 0xfbbf24,
  },
] as const;

// ─── Fonts ──────────────────────────────────────────────────
export const FONTS = {
  HEADING: '"Baloo 2", "Arial Rounded MT Bold", sans-serif',
  BODY: '"Poppins", "Segoe UI", sans-serif',
} as const;
