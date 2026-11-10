import { SAVE_KEY, SAVE_VERSION } from '../config/constants';
import { GameSettings, SaveData, Difficulty } from '../config/types';

export class SaveSystem {
  private saveData: SaveData;

  constructor() {
    this.saveData = this.load();
  }

  private getDefaultSaveData(): SaveData {
    return {
      version: SAVE_VERSION,
      unlockedLevel: 1,
      stars: {},
      bestScores: {},
      bestTimes: {},
      bestFlips: {},
      settings: {
        music: true,
        sound: true,
      },
      difficulty: 'NORMAL' as const,
    };
  }

  public load(): SaveData {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return this.getDefaultSaveData();
      }

      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) {
        return this.getDefaultSaveData();
      }

      const parsed = JSON.parse(raw) as SaveData;
      if (!parsed || parsed.version !== SAVE_VERSION) {
        return this.getDefaultSaveData();
      }

      return {
        ...this.getDefaultSaveData(),
        ...parsed,
        stars: parsed.stars ?? {},
        bestScores: parsed.bestScores ?? {},
        bestTimes: parsed.bestTimes ?? {},
        bestFlips: parsed.bestFlips ?? {},
        settings: {
          ...this.getDefaultSaveData().settings,
          ...(parsed.settings ?? {}),
        },
      };
    } catch {
      return this.getDefaultSaveData();
    }
  }

  public save(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.saveData));
      }
    } catch {
      // Storage quota exceeded or disabled
    }
  }

  public getUnlockedLevel(): number {
    return this.saveData.unlockedLevel;
  }

  public unlockLevel(level: number): void {
    if (level > this.saveData.unlockedLevel) {
      this.saveData.unlockedLevel = level;
      this.save();
    }
  }

  public getStars(levelId: number): number {
    return this.saveData.stars[String(levelId)] ?? 0;
  }

  public setStars(levelId: number, stars: number): void {
    const key = String(levelId);
    const current = this.saveData.stars[key] ?? 0;
    if (stars > current) {
      this.saveData.stars[key] = stars;
      this.save();
    }
  }

  public getBestScore(levelId: number): number {
    return this.saveData.bestScores[String(levelId)] ?? 0;
  }

  public setBestScore(levelId: number, score: number): void {
    const key = String(levelId);
    const current = this.saveData.bestScores[key] ?? 0;
    if (score > current) {
      this.saveData.bestScores[key] = score;
      this.save();
    }
  }

  public getBestTime(levelId: number): number {
    return this.saveData.bestTimes[String(levelId)] ?? 0;
  }

  public setBestTime(levelId: number, time: number): void {
    const key = String(levelId);
    const current = this.saveData.bestTimes[key];
    if (current === undefined || current === 0 || time < current) {
      this.saveData.bestTimes[key] = time;
      this.save();
    }
  }

  public getBestFlips(levelId: number): number {
    return this.saveData.bestFlips[String(levelId)] ?? 0;
  }

  public setBestFlips(levelId: number, flips: number): void {
    const key = String(levelId);
    const current = this.saveData.bestFlips[key];
    if (current === undefined || current === 0 || flips < current) {
      this.saveData.bestFlips[key] = flips;
      this.save();
    }
  }

  public getTotalStars(): number {
    return Object.values(this.saveData.stars).reduce(
      (sum, val) => sum + (typeof val === 'number' ? val : 0),
      0
    );
  }

  public getSettings(): GameSettings {
    return { ...this.saveData.settings };
  }

  public setSettings(settings: GameSettings): void {
    this.saveData.settings = { ...settings };
    this.save();
  }

  // Difficulty getters/setters
  public getDifficulty(): Difficulty {
    return this.saveData.difficulty as any;
  }

  public setDifficulty(diff: Difficulty): void {
    this.saveData.difficulty = diff as any;
    this.save();
  }

  public resetProgress(): void {
    this.saveData = this.getDefaultSaveData();
    this.save();
  }
}

export const saveSystem = new SaveSystem();
export default saveSystem;
