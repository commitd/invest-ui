import { PluginApi, createPluginApi } from 'invest-plugin'
import { loggerFactory } from 'invest-utils'

module.exports = {
    connect: createPluginApi,
    plugin: {
        Api: PluginApi
    },
    utils: {
        loggerFactory
    }
}