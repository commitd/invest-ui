import { VesselPluginApi, createVesselPluginApi } from 'vessel-plugin'
import { loggerFactory } from 'vessel-utils'

module.exports = {
    connect: createVesselPluginApi,
    plugin: {
        Api: VesselPluginApi
    },
    utils: {
        loggerFactory
    }
}