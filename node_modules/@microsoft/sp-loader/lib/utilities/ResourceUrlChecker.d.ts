import { IClientSideComponentManifest } from '@microsoft/sp-module-interfaces';
/**
 * Checks if a resource URL is accessible and throws the right error for each case.
 *
 * In the case of localhost errors, it provides guidance on usage of 'gulp' to solve them.
 */
export default class ResourceUrlChecker {
    private static localhostUrlRegex;
    private static httpsUrlRegex;
    /**
     * Checks the resource URL for the HTTP response status code.
     * If the response is not successful, it throws the appropriate error.
     * @param manifest - Manifest where the resource is defined
     * @param name - Name of the resource to check
     */
    static checkResourceUrl(manifest: IClientSideComponentManifest, name: string): Promise<void>;
    private static _throwUrlStatusError(urlStatus, manifest, resourceName, url);
    private static _getUrlStatus(url);
}
