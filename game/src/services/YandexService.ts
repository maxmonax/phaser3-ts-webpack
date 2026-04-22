import type { YandexGames } from "YaSDK";

export class YandexService {
  private static _ysdk: YandexGames.SDK | null = null;
  private static _readyPromise: Promise<void> | null = null;

  /** Call once at window.load — fires YaGames.init() and stores the promise internally. */
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
      });
  }

  /** Resolves when the SDK is ready (or immediately if unavailable). */
  static waitReady(): Promise<void> {
    return this._readyPromise ?? Promise.resolve();
  }

  static get isReady(): boolean {
    return this._ysdk !== null;
  }

  static get sdk(): YandexGames.SDK | null {
    return this._ysdk;
  }

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

  static showInterstitialAd(callbacks?: NonNullable<Parameters<YandexGames.SDK['adv']['showFullscreenAdv']>[0]>['callbacks']): void {
    this._ysdk?.adv.showFullscreenAdv({ callbacks });
  }

  static showRewardedAd(callbacks?: NonNullable<Parameters<YandexGames.SDK['adv']['showRewardedVideo']>[0]>['callbacks']): void {
    this._ysdk?.adv.showRewardedVideo({ callbacks });
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
