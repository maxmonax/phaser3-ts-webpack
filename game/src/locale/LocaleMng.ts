import { en } from './en';
import { ru } from './ru';
import { Lang, LocaleData, LocaleKey } from './LocaleKeys';

const LOCALES: Record<Lang, LocaleData> = { en, ru };

class LocaleMng {
  private static _instance: LocaleMng;
  private _data: LocaleData = en;
  private _lang: Lang = 'en';
  private _listeners: Array<(lang: Lang) => void> = [];

  static getInstance(): LocaleMng {
    if (!LocaleMng._instance) LocaleMng._instance = new LocaleMng();
    return LocaleMng._instance;
  }

  setLang(lang: Lang): void {
    if (this._lang === lang) return;
    this._lang = lang;
    this._data = LOCALES[lang];
    this._listeners.forEach((cb) => cb(lang));
  }

  getLang(): Lang {
    return this._lang;
  }

  onLangChange(cb: (lang: Lang) => void): void {
    this._listeners.push(cb);
  }

  offLangChange(cb: (lang: Lang) => void): void {
    this._listeners = this._listeners.filter((fn) => fn !== cb);
  }

  t(key: LocaleKey, params?: Record<string, string | number>): string {
    let str = this._data[key];
    if (!params) return str;
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
    return str;
  }
}

export { LocaleMng };

/** Shorthand: `t('key')` or `t('key', { name: 'Max' })` */
export function t(key: LocaleKey, params?: Record<string, string | number>): string {
  return LocaleMng.getInstance().t(key, params);
}
