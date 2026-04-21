export type Lang = 'en' | 'ru';

export type LocaleKey =
    | 'preloader_title'
    | 'preloader_start'
    | 'menu_title'
    | 'menu_lang_btn';

export type LocaleData = Record<LocaleKey, string>;
