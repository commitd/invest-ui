import {
    ApolloClient
} from 'apollo-client'

import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { InvestRpcLink } from 'invest-graphql'
import { loggerFactory } from 'invest-utils'
import { Connection, Handler } from 'invest-rpc'
import { PluginLifecycle } from 'invest-common'

import { PluginApi } from './PluginApi'

const logger = loggerFactory.getLogger('InvestUiPlugin')

export function createPluginApi(handler: Handler<PluginLifecycle>) {
    let client: ApolloClient<{}>
    let connection: Connection<{}> | undefined = undefined

    let safeHandler = handler == null ? {} : handler

    const localMode = isInIFrame()

    if (!localMode) {
        logger.info('Running Standalone')
        client = new ApolloClient({
            link: createHttpLink(),
            cache: new InMemoryCache()
        })
    } else {
        logger.info('Running inside Invest')
        connection = new Connection(window, window.parent, safeHandler)
        connection.start()
        client = new ApolloClient({
            link: new InvestRpcLink({
                connection: connection
            }),
            cache: new InMemoryCache()
        })
    }

    return new PluginApi(localMode, client, connection)
}

function isInIFrame() {
    try {
        return window.self !== window.top
    } catch (e) {
        return true
    }
}