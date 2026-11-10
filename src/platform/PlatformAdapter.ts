export interface PlatformAdapter {
  init(): Promise<void>;
  gameplayStart(): void;
  gameplayStop(): void;
  requestMidgameAd(): Promise<boolean>;
  requestRewardedAd(): Promise<boolean>;
  saveData(key: string, value: string): void;
  loadData(key: string): string | null;
  happytime(): void;
}

export class StandalonePlatform implements PlatformAdapter {
  async init(): Promise<void> {
    // No external initialization needed for standalone web
  }

  gameplayStart(): void {
    // No-op for standalone
  }

  gameplayStop(): void {
    // No-op for standalone
  }

  async requestMidgameAd(): Promise<boolean> {
    return false;
  }

  async requestRewardedAd(): Promise<boolean> {
    return false;
  }

  saveData(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.warn('StandalonePlatform: failed to write to localStorage', err);
      }
    }
  }

  loadData(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch (err) {
        console.warn('StandalonePlatform: failed to read from localStorage', err);
        return null;
      }
    }
    return null;
  }

  happytime(): void {
    // No-op for standalone
  }
}
