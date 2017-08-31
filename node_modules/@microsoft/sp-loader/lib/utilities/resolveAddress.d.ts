import { IClientSideComponentManifest, IPath } from '@microsoft/sp-module-interfaces';
/**
 * Given a manifest and a resource name returns the URL to the resource.
 *
 * For path or localizedPath dependencies, it returns the full URL to the resource.
 * For component dependencies, it returns the full URL to the failover path,
 * or returns an empty string if it doesn't exist.
 *
 * If the resource name is not present in the loader config, it throws an error.
 */
export default function resolveAddress(manifest: IClientSideComponentManifest, resourceName: string): string;
/**
 * Resolves a path to the default or debug version of a script.
 *
 * If a debug version is present, it uses that. Otherwise uses the default one.
 * If the path is a string, it returns it unchanged.
 */
export declare function resolvePath(path: string | IPath): string;
