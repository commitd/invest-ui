export interface PluginLifecycle {

    onLoad?(): void,

    onShow?(): void,

    onHide?(): void

    onUnload?(): void

}