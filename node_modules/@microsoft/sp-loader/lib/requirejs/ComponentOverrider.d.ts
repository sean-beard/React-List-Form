export default class ComponentOverrider {
    /**
     * Given a component id and a component module, it sets the component in the loader, therefore being
     * available without the need of loading it separately.
     * Should only be used when initializing the loader.
     *
     * @param componentId - Id of the component to override. There should be only one version of the component.
     * @param componentModule - Component module.
     */
    static overrideComponent<TComponent>(componentId: string, componentModule: TComponent): void;
}
