import { LevelData } from '../config/types';

export const WORLD_1_LEVELS: LevelData[] = [
  // ─── Level 1: First Flip (Tutorial - Easy) ────────────────
  {
    id: 1,
    world: 1,
    name: 'First Flip',
    gravity: 'DOWN',
    flipTarget: 1,
    timeTarget: 12,
    playerStart: { x: 100, y: 420 },
    exit: { x: 850, y: 85 },
    collectible: { x: 480, y: 260 },
    platforms: [
      { x: 50, y: 450, width: 200, height: 28 },
      { x: 700, y: 60, width: 220, height: 28 },
    ],
    hazards: [],
  },

  // ─── Level 2: Spike Awareness ─────────────────────────────
  {
    id: 2,
    world: 1,
    name: 'Spike Awareness',
    gravity: 'DOWN',
    flipTarget: 2,
    timeTarget: 15,
    playerStart: { x: 100, y: 420 },
    exit: { x: 850, y: 420 },
    collectible: { x: 480, y: 100 },
    platforms: [
      { x: 50, y: 450, width: 180, height: 28 },
      { x: 350, y: 60, width: 260, height: 28 },
      { x: 700, y: 450, width: 220, height: 28 },
    ],
    hazards: [
      { type: 'spike', x: 300, y: 520, direction: 'up' },
      { type: 'spike', x: 340, y: 520, direction: 'up' },
      { type: 'spike', x: 380, y: 520, direction: 'up' },
      { type: 'spike', x: 420, y: 520, direction: 'up' },
      { type: 'spike', x: 460, y: 520, direction: 'up' },
      { type: 'spike', x: 500, y: 520, direction: 'up' },
      { type: 'spike', x: 540, y: 520, direction: 'up' },
      { type: 'spike', x: 580, y: 520, direction: 'up' },
      { type: 'spike', x: 620, y: 520, direction: 'up' },
      { type: 'spike', x: 660, y: 520, direction: 'up' },
    ],
  },

  // ─── Level 3: Double Flip ─────────────────────────────────
  {
    id: 3,
    world: 1,
    name: 'Double Flip',
    gravity: 'DOWN',
    flipTarget: 3,
    timeTarget: 18,
    playerStart: { x: 80, y: 420 },
    exit: { x: 870, y: 420 },
    collectible: { x: 480, y: 80 },
    platforms: [
      { x: 40, y: 450, width: 160, height: 28 },
      { x: 260, y: 60, width: 160, height: 28 },
      { x: 500, y: 450, width: 100, height: 28 },
      { x: 700, y: 60, width: 120, height: 28 },
      { x: 800, y: 450, width: 140, height: 28 },
    ],
    hazards: [
      { type: 'spike', x: 230, y: 520, direction: 'up' },
      { type: 'spike', x: 270, y: 520, direction: 'up' },
      { type: 'spike', x: 620, y: 520, direction: 'up' },
      { type: 'spike', x: 660, y: 520, direction: 'up' },
      { type: 'spike', x: 700, y: 520, direction: 'up' },
    ],
  },

  // ─── Level 4: The Gauntlet (Medium) ───────────────────────
  {
    id: 4,
    world: 1,
    name: 'The Gauntlet',
    gravity: 'DOWN',
    flipTarget: 4,
    timeTarget: 18,
    playerStart: { x: 80, y: 420 },
    exit: { x: 870, y: 80 },
    collectible: { x: 600, y: 420 },
    platforms: [
      { x: 40, y: 450, width: 130, height: 28 },
      { x: 200, y: 60, width: 100, height: 28 },
      { x: 360, y: 310, width: 80, height: 28 },
      { x: 500, y: 450, width: 80, height: 28 },
      { x: 640, y: 200, width: 80, height: 28 },
      { x: 790, y: 60, width: 140, height: 28 },
    ],
    hazards: [
      { type: 'spike', x: 180, y: 520, direction: 'up' },
      { type: 'spike', x: 220, y: 520, direction: 'up' },
      { type: 'spike', x: 260, y: 520, direction: 'up' },
      { type: 'spike', x: 300, y: 520, direction: 'up' },
      { type: 'spike', x: 420, y: 20, direction: 'down' },
      { type: 'spike', x: 460, y: 20, direction: 'down' },
      { type: 'spike', x: 560, y: 520, direction: 'up' },
      { type: 'spike', x: 720, y: 20, direction: 'down' },
    ],
  },

  // ─── Level 5: Spike Corridor ──────────────────────────────
  {
    id: 5,
    world: 1,
    name: 'Spike Corridor',
    gravity: 'DOWN',
    flipTarget: 5,
    timeTarget: 20,
    playerStart: { x: 80, y: 320 },
    exit: { x: 860, y: 320 },
    collectible: { x: 480, y: 200 },
    platforms: [
      { x: 40, y: 350, width: 120, height: 28 },
      // Top and bottom corridor
      { x: 200, y: 390, width: 560, height: 20 },
      { x: 200, y: 130, width: 560, height: 20 },
      { x: 800, y: 350, width: 130, height: 28 },
    ],
    hazards: [
      // Bottom spikes inside corridor
      { type: 'spike', x: 280, y: 375, direction: 'up' },
      { type: 'spike', x: 340, y: 375, direction: 'up' },
      { type: 'spike', x: 420, y: 375, direction: 'up' },
      { type: 'spike', x: 520, y: 375, direction: 'up' },
      { type: 'spike', x: 600, y: 375, direction: 'up' },
      { type: 'spike', x: 680, y: 375, direction: 'up' },
      // Top spikes inside corridor
      { type: 'spike', x: 310, y: 165, direction: 'down' },
      { type: 'spike', x: 380, y: 165, direction: 'down' },
      { type: 'spike', x: 460, y: 165, direction: 'down' },
      { type: 'spike', x: 560, y: 165, direction: 'down' },
      { type: 'spike', x: 640, y: 165, direction: 'down' },
      { type: 'spike', x: 720, y: 165, direction: 'down' },
    ],
  },

  // ─── Level 6: Precision Landing ───────────────────────────
  {
    id: 6,
    world: 1,
    name: 'Precision Landing',
    gravity: 'DOWN',
    flipTarget: 5,
    timeTarget: 22,
    playerStart: { x: 80, y: 420 },
    exit: { x: 870, y: 420 },
    collectible: { x: 480, y: 260 },
    platforms: [
      { x: 40, y: 450, width: 100, height: 28 },
      { x: 200, y: 60, width: 60, height: 28 },
      { x: 340, y: 450, width: 50, height: 28 },
      { x: 440, y: 280, width: 60, height: 28 },
      { x: 560, y: 60, width: 50, height: 28 },
      { x: 680, y: 450, width: 50, height: 28 },
      { x: 820, y: 450, width: 100, height: 28 },
    ],
    hazards: [
      { type: 'spike', x: 160, y: 520, direction: 'up' },
      { type: 'spike', x: 200, y: 520, direction: 'up' },
      { type: 'spike', x: 240, y: 520, direction: 'up' },
      { type: 'spike', x: 280, y: 520, direction: 'up' },
      { type: 'spike', x: 400, y: 520, direction: 'up' },
      { type: 'spike', x: 440, y: 520, direction: 'up' },
      { type: 'spike', x: 480, y: 520, direction: 'up' },
      { type: 'spike', x: 520, y: 520, direction: 'up' },
      { type: 'spike', x: 560, y: 520, direction: 'up' },
      { type: 'spike', x: 620, y: 520, direction: 'up' },
      { type: 'spike', x: 640, y: 20, direction: 'down' },
      { type: 'spike', x: 740, y: 520, direction: 'up' },
      { type: 'spike', x: 780, y: 520, direction: 'up' },
    ],
  },

  // ─── Level 7: The Labyrinth (Hard) ────────────────────────
  {
    id: 7,
    world: 1,
    name: 'The Labyrinth',
    gravity: 'DOWN',
    flipTarget: 6,
    timeTarget: 25,
    playerStart: { x: 80, y: 420 },
    exit: { x: 870, y: 80 },
    collectible: { x: 620, y: 370 },
    platforms: [
      { x: 40, y: 450, width: 100, height: 28 },
      // Vertical walls
      { x: 180, y: 200, width: 28, height: 280 },
      { x: 380, y: 60, width: 28, height: 280 },
      { x: 580, y: 200, width: 28, height: 280 },
      // Stepping platforms
      { x: 80, y: 60, width: 100, height: 28 },
      { x: 230, y: 300, width: 100, height: 28 },
      { x: 430, y: 60, width: 100, height: 28 },
      { x: 430, y: 450, width: 100, height: 28 },
      { x: 630, y: 300, width: 80, height: 28 },
      { x: 780, y: 60, width: 150, height: 28 },
    ],
    hazards: [
      { type: 'spike', x: 160, y: 520, direction: 'up' },
      { type: 'spike', x: 300, y: 520, direction: 'up' },
      { type: 'spike', x: 340, y: 520, direction: 'up' },
      { type: 'spike', x: 540, y: 520, direction: 'up' },
      { type: 'spike', x: 280, y: 20, direction: 'down' },
      { type: 'spike', x: 500, y: 20, direction: 'down' },
      { type: 'spike', x: 680, y: 520, direction: 'up' },
      { type: 'spike', x: 720, y: 520, direction: 'up' },
      { type: 'spike', x: 760, y: 520, direction: 'up' },
      { type: 'spike', x: 700, y: 20, direction: 'down' },
    ],
  },

  // ─── Level 8: Ceiling Walk ────────────────────────────────
  {
    id: 8,
    world: 1,
    name: 'Ceiling Walk',
    gravity: 'DOWN',
    flipTarget: 7,
    timeTarget: 25,
    playerStart: { x: 80, y: 420 },
    exit: { x: 870, y: 420 },
    collectible: { x: 480, y: 100 },
    platforms: [
      { x: 40, y: 450, width: 100, height: 28 },
      // Ceiling platforms (walk upside down)
      { x: 180, y: 60, width: 120, height: 28 },
      { x: 340, y: 60, width: 60, height: 28 },
      // Floor platforms (sparse)
      { x: 300, y: 450, width: 50, height: 28 },
      { x: 440, y: 280, width: 80, height: 28 },
      // More ceiling
      { x: 520, y: 60, width: 60, height: 28 },
      { x: 630, y: 60, width: 80, height: 28 },
      // Final floor
      { x: 700, y: 450, width: 50, height: 28 },
      { x: 820, y: 450, width: 100, height: 28 },
    ],
    hazards: [
      { type: 'spike', x: 160, y: 520, direction: 'up' },
      { type: 'spike', x: 200, y: 520, direction: 'up' },
      { type: 'spike', x: 240, y: 520, direction: 'up' },
      { type: 'spike', x: 400, y: 520, direction: 'up' },
      { type: 'spike', x: 440, y: 520, direction: 'up' },
      { type: 'spike', x: 480, y: 520, direction: 'up' },
      { type: 'spike', x: 520, y: 520, direction: 'up' },
      { type: 'spike', x: 560, y: 520, direction: 'up' },
      { type: 'spike', x: 600, y: 520, direction: 'up' },
      { type: 'spike', x: 640, y: 520, direction: 'up' },
      { type: 'spike', x: 680, y: 520, direction: 'up' },
      { type: 'spike', x: 770, y: 520, direction: 'up' },
      // Ceiling spikes in gaps
      { type: 'spike', x: 460, y: 20, direction: 'down' },
      { type: 'spike', x: 500, y: 20, direction: 'down' },
    ],
  },

  // ─── Level 9: No Margin ───────────────────────────────────
  {
    id: 9,
    world: 1,
    name: 'No Margin',
    gravity: 'DOWN',
    flipTarget: 8,
    timeTarget: 28,
    playerStart: { x: 80, y: 420 },
    exit: { x: 870, y: 80 },
    collectible: { x: 700, y: 320 },
    platforms: [
      { x: 40, y: 450, width: 80, height: 28 },
      { x: 170, y: 60, width: 50, height: 28 },
      { x: 270, y: 350, width: 50, height: 28 },
      { x: 360, y: 60, width: 50, height: 28 },
      { x: 440, y: 450, width: 50, height: 28 },
      { x: 520, y: 200, width: 50, height: 28 },
      { x: 600, y: 60, width: 50, height: 28 },
      { x: 680, y: 340, width: 50, height: 28 },
      { x: 780, y: 60, width: 120, height: 28 },
    ],
    hazards: [
      { type: 'spike', x: 140, y: 520, direction: 'up' },
      { type: 'spike', x: 180, y: 520, direction: 'up' },
      { type: 'spike', x: 220, y: 520, direction: 'up' },
      { type: 'spike', x: 330, y: 520, direction: 'up' },
      { type: 'spike', x: 370, y: 520, direction: 'up' },
      { type: 'spike', x: 410, y: 520, direction: 'up' },
      { type: 'spike', x: 500, y: 520, direction: 'up' },
      { type: 'spike', x: 540, y: 520, direction: 'up' },
      { type: 'spike', x: 580, y: 520, direction: 'up' },
      { type: 'spike', x: 620, y: 520, direction: 'up' },
      { type: 'spike', x: 660, y: 520, direction: 'up' },
      { type: 'spike', x: 730, y: 520, direction: 'up' },
      { type: 'spike', x: 250, y: 20, direction: 'down' },
      { type: 'spike', x: 450, y: 20, direction: 'down' },
      { type: 'spike', x: 550, y: 20, direction: 'down' },
      { type: 'spike', x: 700, y: 20, direction: 'down' },
    ],
  },

  // ─── Level 10: Gravity Master ─────────────────────────────
  {
    id: 10,
    world: 1,
    name: 'Gravity Master',
    gravity: 'DOWN',
    flipTarget: 10,
    timeTarget: 35,
    playerStart: { x: 80, y: 420 },
    exit: { x: 870, y: 260 },
    collectible: { x: 480, y: 260 },
    platforms: [
      { x: 40, y: 450, width: 80, height: 28 },
      // Alternating ceiling/floor tiny platforms
      { x: 150, y: 60, width: 50, height: 24 },
      { x: 230, y: 450, width: 40, height: 24 },
      { x: 310, y: 60, width: 40, height: 24 },
      { x: 380, y: 450, width: 40, height: 24 },
      { x: 450, y: 270, width: 60, height: 24 },
      { x: 540, y: 60, width: 40, height: 24 },
      { x: 610, y: 450, width: 40, height: 24 },
      { x: 690, y: 60, width: 40, height: 24 },
      { x: 770, y: 450, width: 40, height: 24 },
      { x: 840, y: 280, width: 80, height: 24 },
    ],
    hazards: [
      // Spikes covering almost every gap
      { type: 'spike', x: 130, y: 520, direction: 'up' },
      { type: 'spike', x: 170, y: 520, direction: 'up' },
      { type: 'spike', x: 280, y: 520, direction: 'up' },
      { type: 'spike', x: 340, y: 520, direction: 'up' },
      { type: 'spike', x: 430, y: 520, direction: 'up' },
      { type: 'spike', x: 500, y: 520, direction: 'up' },
      { type: 'spike', x: 560, y: 520, direction: 'up' },
      { type: 'spike', x: 650, y: 520, direction: 'up' },
      { type: 'spike', x: 730, y: 520, direction: 'up' },
      { type: 'spike', x: 820, y: 520, direction: 'up' },
      // Ceiling spikes
      { type: 'spike', x: 200, y: 20, direction: 'down' },
      { type: 'spike', x: 260, y: 20, direction: 'down' },
      { type: 'spike', x: 360, y: 20, direction: 'down' },
      { type: 'spike', x: 420, y: 20, direction: 'down' },
      { type: 'spike', x: 500, y: 20, direction: 'down' },
      { type: 'spike', x: 580, y: 20, direction: 'down' },
      { type: 'spike', x: 640, y: 20, direction: 'down' },
      { type: 'spike', x: 740, y: 20, direction: 'down' },
      { type: 'spike', x: 800, y: 20, direction: 'down' },
    ],
  },
];

const levelMap = new Map<number, LevelData>(
  WORLD_1_LEVELS.map((level) => [level.id, level])
);

export function getLevelData(id: number): LevelData | undefined {
  return levelMap.get(id);
}

export function getAllLevelData(): LevelData[] {
  return [...WORLD_1_LEVELS];
}
