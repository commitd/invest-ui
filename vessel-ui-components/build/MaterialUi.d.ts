/// <reference types="react" />
import * as React from 'react';
export interface Props {
    theme?: object;
}
declare class MaterialUi extends React.Component<Props, {}> {
    static defaultProps: {
        theme: {};
    };
    private theme;
    constructor(props: Props);
    render(): JSX.Element;
}
export default MaterialUi;
