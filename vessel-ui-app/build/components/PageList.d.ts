/// <reference types="react" />
import * as React from 'react';
import { UiPlugin } from 'vessel-types';
export interface Props {
    plugins: UiPlugin[];
    selectedPlugin: UiPlugin;
    onPluginSelected(plugin: UiPlugin): void;
}
declare class PageList extends React.Component<Props, {}> {
    render(): JSX.Element;
}
export default PageList;
