import { VesselPluginApi, createVesselPluginApi } from 'vessel-plugin'
import { loggerFactory } from 'vessel-utils'

module.exports = {
    plugin: {
        create: createVesselPluginApi,
        Api: VesselPluginApi
    },
    utils: {
        loggerFactory
    }
}