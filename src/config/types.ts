// ─── Difficulty ───────────────────────────────────────────────
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

// ─── Gravity Direction ───────────────────────────────────────
export type GravityDirection = 'UP' | 'DOWN';

// ─── Level Data Structures ──────────────────────────────────
export interface Vec2 {
  x: number;
  y: number;
}

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HazardData {
  type: 'spike';
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface MovingHazardData {
  type: 'moving';
  x: number;
  y: number;
  width: number;
  height: number;
  path: Vec2[];
  speed: number;
}

export interface MovingPlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  path: Vec2[];
  speed: number;
  pauseDuration?: number;
}

export interface FallingPlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
}

export interface CheckpointData {
  x: number;
  y: number;
}

export interface SwitchData {
  id: string;
  x: number;
  y: number;
  targetId: string;
  type: 'toggle' | 'oneshot';
}

export interface DoorData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  open: boolean;
}

export interface PortalPairData {
  a: Vec2;
  b: Vec2;
}

export interface LevelData {
  id: number;
  world: number;
  name: string;
  playerStart: Vec2;
  gravity: GravityDirection;
  flipTarget: number;
  timeTarget: number;
  worldWidth?: number;
  worldHeight?: number;
  collectible?: Vec2;
  exit: Vec2;
  platforms: PlatformData[];
  hazards: HazardData[];
  movingHazards?: MovingHazardData[];
  movingPlatforms?: MovingPlatformData[];
  fallingPlatforms?: FallingPlatformData[];
  checkpoints?: CheckpointData[];
  switches?: SwitchData[];
  doors?: DoorData[];
  portalPairs?: PortalPairData[];
}

// ─── Save Data ──────────────────────────────────────────────
export interface SaveData {
  version: number;
  unlockedLevel: number;
  stars: Record<string, number>;
  bestScores: Record<string, number>;
  bestTimes: Record<string, number>;
  bestFlips: Record<string, number>;
  settings: GameSettings;
  difficulty: Difficulty;
  dailyChallenge?: DailyChallengeData;
}

export interface GameSettings {
  music: boolean;
  sound: boolean;
}

export interface DailyChallengeData {
  lastCompletedDate: string;
  streak: number;
}

// ─── Level Results ──────────────────────────────────────────
export interface LevelResult {
  levelId: number;
  completed: boolean;
  time: number;
  flips: number;
  collectedStar: boolean;
  score: number;
  stars: number;
}

// ─── Input State ────────────────────────────────────────────
export interface InputState {
  left: boolean;
  right: boolean;
  flip: boolean;
  restart: boolean;
  pause: boolean;
}

// ─── Checkpoint State ───────────────────────────────────────
export interface CheckpointState {
  position: Vec2;
  gravityDirection: GravityDirection;
  collectedStar: boolean;
  flipCount: number;
  time: number;
}

// ─── World Info ─────────────────────────────────────────────
export function getWorldForLevel(levelId: number): number {
  if (levelId <= 10) return 0;
  if (levelId <= 15) return 1;
  if (levelId <= 20) return 2;
  if (levelId <= 25) return 3;
  return 4;
}

export function getLevelIndexInWorld(levelId: number): number {
  if (levelId <= 10) return levelId - 1;
  if (levelId <= 15) return levelId - 11;
  if (levelId <= 20) return levelId - 16;
  if (levelId <= 25) return levelId - 21;
  return levelId - 26;
}
