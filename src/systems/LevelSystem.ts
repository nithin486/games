import { LevelData } from '../config/types';
import { getAllLevelData, getLevelData as fetchLevelData } from '../data/levelData';

export class LevelSystem {
  private levels: Map<number, LevelData> = new Map();

  constructor() {
    this.loadAllLevels();
  }

  public loadAllLevels(): void {
    const list = getAllLevelData();
    this.levels.clear();
    for (const lvl of list) {
      if (this.validateLevel(lvl)) {
        this.levels.set(lvl.id, lvl);
      }
    }
  }

  public getLevel(id: number): LevelData | undefined {
    return this.levels.get(id);
  }

  public getAllLevels(): LevelData[] {
    return Array.from(this.levels.values());
  }

  public validateLevel(data: LevelData): boolean {
    if (!data) return false;
    if (typeof data.id !== 'number' || data.id <= 0) return false;
    if (typeof data.world !== 'number') return false;
    if (typeof data.name !== 'string' || data.name.trim().length === 0) return false;
    if (!data.playerStart || typeof data.playerStart.x !== 'number' || typeof data.playerStart.y !== 'number') return false;
    if (data.gravity !== 'DOWN' && data.gravity !== 'UP') return false;
    if (typeof data.flipTarget !== 'number' || data.flipTarget <= 0) return false;
    if (typeof data.timeTarget !== 'number' || data.timeTarget <= 0) return false;
    if (!data.exit || typeof data.exit.x !== 'number' || typeof data.exit.y !== 'number') return false;
    if (!Array.isArray(data.platforms)) return false;
    if (!Array.isArray(data.hazards)) return false;

    return true;
  }
}

export const levelSystem = new LevelSystem();

export function getLevelData(id: number): LevelData | undefined {
  return levelSystem.getLevel(id) ?? fetchLevelData(id);
}
