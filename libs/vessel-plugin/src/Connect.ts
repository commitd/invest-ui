
import {
    ApolloClient
} from 'react-apollo'

import { createApolloRpcClient } from 'vessel-graphql'
import { loggerFactory } from 'vessel-utils'
import { Connection, Handler } from 'vessel-rpc'
import { VesselPluginApi } from './VesselPluginApi'
import { PluginLifecycle } from 'vessel-common'

const logger = loggerFactory.getLogger('VesselUiPlugin')

export function createVesselPluginApi(handler: Handler<PluginLifecycle>) {
    let client: ApolloClient
    let connection: Connection<{}> | undefined = undefined

    let safeHandler = handler == null ? {} : handler

    if (!isInIFrame()) {
        logger.info('Running standalone')
        client = new ApolloClient()
    } else {
        logger.info('Running inside vessel')
        connection = new Connection(window, window.parent, safeHandler)
        connection.start()
        client = createApolloRpcClient({
            connection: connection
        })
    }

    return new VesselPluginApi(client, connection)
}

function isInIFrame() {
    try {
        return window.self !== window.top
    } catch (e) {
        return true
    }
}