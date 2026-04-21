export class DeviceInfo {
  private static instance: DeviceInfo | null = null;
  private _desktop = false;
  private _iOS = false;
  private _android = false;
  private _safari = false;

  private constructor() {
    const ua = navigator.userAgent;
    this._iOS = /iPad|iPhone|iPod/.test(ua);
    this._android = /Android/.test(ua);
    this._safari = /Safari/.test(ua) && !/Chrome|Chromium/.test(ua);
    this._desktop = !this._iOS && !this._android && !/Mobile|IEMobile|BlackBerry|Silk/.test(ua);
  }

  static getInstance(): DeviceInfo {
    if (!DeviceInfo.instance) {
      DeviceInfo.instance = new DeviceInfo();
    }
    return DeviceInfo.instance;
  }

  public get desktop(): boolean {
    return this._desktop;
  }

  public get iOS(): boolean {
    return this._iOS;
  }

  public get android(): boolean {
    return this._android;
  }

  public get safari(): boolean {
    return this._safari;
  }

  public get devicePixelRatio(): number {
    return window.devicePixelRatio || 1;
  }
}
