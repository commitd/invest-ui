
import {
    ApolloClient
} from 'react-apollo'

import { createApolloRpcClient } from 'invest-graphql'
import { loggerFactory } from 'invest-utils'
import { Connection, Handler } from 'invest-rpc'
import { PluginApi } from './PluginApi'
import { PluginLifecycle } from 'invest-common'

const logger = loggerFactory.getLogger('InvestUiPlugin')

export function createPluginApi(handler: Handler<PluginLifecycle>) {
    let client: ApolloClient
    let connection: Connection<{}> | undefined = undefined

    let safeHandler = handler == null ? {} : handler

    if (!isInIFrame()) {
        logger.info('Running Standalone')
        client = new ApolloClient()
    } else {
        logger.info('Running inside Invest')
        connection = new Connection(window, window.parent, safeHandler)
        connection.start()
        client = createApolloRpcClient({
            connection: connection
        })
    }

    return new PluginApi(client, connection)
}

function isInIFrame() {
    try {
        return window.self !== window.top
    } catch (e) {
        return true
    }
}