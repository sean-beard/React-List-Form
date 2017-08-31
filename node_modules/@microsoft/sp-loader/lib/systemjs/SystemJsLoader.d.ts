// [ts-npm-lint] removed reference to '../../typings/es-module-loader/es-module-loader.d.ts'
/// <reference types="systemjs" />
import { IClientSideComponentManifest } from '@microsoft/sp-module-interfaces';
/**
 * Loader for SystemJS.
 * Provides the instance of SystemJS and allows methods for configuration.
 */
export default class SystemJsLoader {
    static readonly pluginName: string;
    private static readonly systemImportEventName;
    /**
     * This is the configured base URL for SystemJS.
     * When a user tries to call SystemJS with a relative path, an error will show this as the base URL.
     *
     * Example:
     * System.import("myModule") => Error: https://relative-path.invalid/myModule not found
     */
    private static readonly _invalidBaseUrl;
    private static _instance;
    static readonly instance: SystemJsLoader;
    private _originalSystemConfig;
    private _system;
    private _configuredFailoverPaths;
    /**
     * If a module hasn't been loaded with the specified name,
     * it created a new module and sets it in SystemJS
     */
    ensure(name: string, module: any): void;
    /**
     * If a module has been loaded with the specified name,
     * it delete it from SystemJS
     */
    delete(name: string): void;
    /**
     * Calls actual System.config()
     */
    systemConfig(config: SystemJSLoader.Config): void;
    /**
     * Calls System.import()
     * Catches exceptions and returns a rejected promise with the error from SystemJS
     */
    systemImport<TModule>(name: string): Promise<TModule>;
    /** Calls System.delete() with the name matching the input manifest */
    systemDelete(manifest: IClientSideComponentManifest): void;
    /**
     * Sets the config for SystemJS. Handles global exports, renames the dependencies.
     * Also sets AddressStore with the right mapping between script and URL.
     */
    configure(manifest: IClientSideComponentManifest): void;
    /**
     * Returns the dependencies of a component, as detected by SystemJS when importing the module.
     * This method ignores the manifest dependencies and looks only at the JS file instead.
     * Used as a helper to find mismatching dependencies.
     *
     * @returns Array with the dependencies in a component. Empty array if dependencies could not be found.
     */
    getDependencies(manifest: IClientSideComponentManifest): string[];
    /**
     * Executes the base configuration for SystemJS. It should be private but it's public
     * so STS pages can modify scriptLoad to be false.
     */
    _baseSystemConfig(pluginName: string, scriptLoad: boolean): void;
    private _initialize();
    private _loadSystemJs();
    private _setCustomLoader(pluginName, system);
    /**
     * Returns the id used by SystemJS in System.defined.
     * This allows to browse through SystemJS internals for additional data, like the JS dependencies.
     */
    private getDefinedId(manifest);
}
