/**
 * @internal
 */
export interface ICookieAttributes {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
}
export default class Cookie {
    private _cookie;
    static tryGetCookie(cookieId: string): string | undefined;
    static setCookie(id: string, value: string, attributes?: ICookieAttributes): void;
    static buildCookie(id: string, value: string, attributes?: ICookieAttributes): string;
    constructor(cookie?: string);
    tryGetCookie(cookieId: string): string | undefined;
}
