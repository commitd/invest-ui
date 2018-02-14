export interface PluginLifecycle {

    onLoad?(): void,

    onShow?(): void,

    onAction?(action: string, payload?: {}): void,

    onHide?(): void

    onUnload?(): void

}