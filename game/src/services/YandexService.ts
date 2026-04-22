import type { YandexGames } from "YaSDK";

const INTERSTITIAL_COOLDOWN_MIN = 1.1;

export class YandexService {
  private static _ysdk: YandexGames.SDK | null = null;
  private static _readyPromise: Promise<void> | null = null;
  private static _initFailed = false;
  private static _lastInterstitialTimeMin = -999;

  /** Call once at window.load — fires YaGames.init() in parallel with game start. */
  static init(): void {
    if (this._readyPromise) return;

    if (typeof YaGames === 'undefined') {
      this._readyPromise = Promise.resolve();
      return;
    }

    this._readyPromise = YaGames.init()
      .then((ysdk) => {
        this._ysdk = ysdk;
      })
      .catch((err: unknown) => {
        console.error('[YandexService] init error:', err);
        this._initFailed = true;
      });
  }

  /** Resolves when the SDK is ready (or failed — check initFailed after). */
  static waitReady(): Promise<void> {
    return this._readyPromise ?? Promise.resolve();
  }

  static get isReady(): boolean { return this._ysdk !== null; }
  static get initFailed(): boolean { return this._initFailed; }
  static get sdk(): YandexGames.SDK | null { return this._ysdk; }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  /** Call after PreloaderScene completes — tells Yandex the game is ready. */
  static notifyLoaded(): void {
    this._ysdk?.features.LoadingAPI.ready();
  }

  /** Call when active gameplay starts (e.g. entering GameScene). */
  static gameplayStart(): void {
    this._ysdk?.features.GameplayAPI.start();
  }

  /** Call when gameplay pauses or player returns to menu. */
  static gameplayStop(): void {
    this._ysdk?.features.GameplayAPI.stop();
  }

  // ─── Ads ──────────────────────────────────────────────────────────────────

  private static getTimeMin(): number {
    return Date.now() / 1000 / 60;
  }

  static isInterstitialReady(): boolean {
    return this.getTimeMin() - this._lastInterstitialTimeMin > INTERSTITIAL_COOLDOWN_MIN;
  }

  /**
   * Shows interstitial ad with cooldown guard and auto sound mute.
   * If cooldown hasn't passed, calls onClose immediately without showing the ad.
   */
  static showInterstitialAd(
    game: Phaser.Game,
    callbacks?: NonNullable<Parameters<YandexGames.SDK['adv']['showFullscreenAdv']>[0]>['callbacks']
  ): void {
    if (!this.isInterstitialReady()) {
      callbacks?.onClose?.(false);
      return;
    }
    this._lastInterstitialTimeMin = this.getTimeMin();
    this._ysdk?.adv.showFullscreenAdv({
      callbacks: {
        onOpen: () => {
          game.sound.mute = true;
          callbacks?.onOpen?.();
        },
        onClose: (wasShown) => {
          game.sound.mute = false;
          callbacks?.onClose?.(wasShown);
        },
        onError: callbacks?.onError,
        onOffline: callbacks?.onOffline,
      },
    });
  }

  /** Shows rewarded ad with auto sound mute. */
  static showRewardedAd(
    game: Phaser.Game,
    callbacks?: NonNullable<Parameters<YandexGames.SDK['adv']['showRewardedVideo']>[0]>['callbacks']
  ): void {
    this._ysdk?.adv.showRewardedVideo({
      callbacks: {
        onOpen: () => {
          game.sound.mute = true;
          callbacks?.onOpen?.();
        },
        onRewarded: callbacks?.onRewarded,
        onClose: (wasShown) => {
          game.sound.mute = false;
          callbacks?.onClose?.(wasShown);
        },
        onError: callbacks?.onError,
      },
    });
  }

  // ─── Player ───────────────────────────────────────────────────────────────

  static getPlayer(opts?: { signed?: boolean; scopes?: boolean }): Promise<YandexGames.Player> | null {
    return this._ysdk?.getPlayer(opts) ?? null;
  }

  // ─── Leaderboards ─────────────────────────────────────────────────────────

  static getLeaderboards(): Promise<YandexGames.Leaderboards> | null {
    return this._ysdk?.getLeaderboards() ?? null;
  }

  // ─── Payments ─────────────────────────────────────────────────────────────

  static getPayments(opts?: { signed?: boolean }): Promise<YandexGames.Payments> | null {
    return this._ysdk?.getPayments(opts) ?? null;
  }
}
