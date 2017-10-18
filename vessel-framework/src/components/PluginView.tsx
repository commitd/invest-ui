import * as React from 'react'

import { Handler } from 'vessel-rpc'
import { UiPlugin } from 'vessel-types'
import IFrame from './IFrame'

export interface Props {
    plugin: UiPlugin
    globalHandler: Handler<{}>
    hide?: boolean
}

class PluginView extends React.Component<Props> {

    handler: Handler<{}>

    constructor(props: Props) {
        super(props)

        // TODO: Add any per iframe functions here
        this.handler = this.props.globalHandler
    }

    render() {
        const { plugin, hide } = this.props
        return (
            <IFrame src={plugin.url} handler={this.handler} hide={hide} />
        )
    }
}

export default PluginView