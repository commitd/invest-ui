/// <reference types="react" />
import * as React from 'react';
import Connection, { Handler } from 'vessel-rpc';
export interface Props<S> {
    src: string;
    handler?: Handler<S>;
    onLoad?(connection: Connection<S>): void;
}
declare class IFrame<S> extends React.Component<Props<S>, {}> {
    private ref;
    private connection;
    componentDidMount(): void;
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: Props<S>): boolean;
    render(): JSX.Element;
}
export default IFrame;
