/**
  * @internal
  */
export default class LocaleStore {
    private static _locale;
    static getLocale(): string | undefined;
    static setLocale(locale: string): void;
}
