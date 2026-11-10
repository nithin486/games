import { PlatformAdapter } from './PlatformAdapter';

export class CrazyGamesPlatform implements PlatformAdapter {
  private sdk: any = null;

  async init(): Promise<void> {
    if (typeof window !== 'undefined' && (window as any).CrazyGames?.SDK) {
      try {
        this.sdk = (window as any).CrazyGames.SDK;
        await this.sdk.init();
      } catch (err) {
        console.warn('CrazyGamesPlatform: SDK initialization failed', err);
      }
    }
  }

  gameplayStart(): void {
    if (this.sdk?.game?.gameplayStart) {
      try {
        this.sdk.game.gameplayStart();
      } catch (err) {
        console.warn('CrazyGamesPlatform: gameplayStart error', err);
      }
    }
  }

  gameplayStop(): void {
    if (this.sdk?.game?.gameplayStop) {
      try {
        this.sdk.game.gameplayStop();
      } catch (err) {
        console.warn('CrazyGamesPlatform: gameplayStop error', err);
      }
    }
  }

  async requestMidgameAd(): Promise<boolean> {
    if (!this.sdk?.ad?.requestAd) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      try {
        this.sdk.ad.requestAd('midgame', {
          adStarted: () => {
            // Midgame ad started
          },
          adFinished: () => {
            resolve(true);
          },
          adError: (error: any) => {
            console.warn('CrazyGamesPlatform: midgame ad error', error);
            resolve(false);
          },
        });
      } catch (err) {
        console.warn('CrazyGamesPlatform: requestMidgameAd call failed', err);
        resolve(false);
      }
    });
  }

  async requestRewardedAd(): Promise<boolean> {
    if (!this.sdk?.ad?.requestAd) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      try {
        this.sdk.ad.requestAd('rewarded', {
          adStarted: () => {
            // Rewarded ad started
          },
          adFinished: () => {
            resolve(true);
          },
          adError: (error: any) => {
            console.warn('CrazyGamesPlatform: rewarded ad error', error);
            resolve(false);
          },
        });
      } catch (err) {
        console.warn('CrazyGamesPlatform: requestRewardedAd call failed', err);
        resolve(false);
      }
    });
  }

  saveData(key: string, value: string): void {
    if (this.sdk?.data?.setItem) {
      try {
        this.sdk.data.setItem(key, value);
        return;
      } catch (err) {
        console.warn('CrazyGamesPlatform: data.setItem failed, falling back to localStorage', err);
      }
    }

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.warn('CrazyGamesPlatform: localStorage fallback failed', err);
      }
    }
  }

  loadData(key: string): string | null {
    if (this.sdk?.data?.getItem) {
      try {
        return this.sdk.data.getItem(key);
      } catch (err) {
        console.warn('CrazyGamesPlatform: data.getItem failed, falling back to localStorage', err);
      }
    }

    if (typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch (err) {
        console.warn('CrazyGamesPlatform: localStorage load fallback failed', err);
        return null;
      }
    }

    return null;
  }

  happytime(): void {
    if (this.sdk?.game?.happytime) {
      try {
        this.sdk.game.happytime();
      } catch (err) {
        console.warn('CrazyGamesPlatform: happytime error', err);
      }
    }
  }
}
