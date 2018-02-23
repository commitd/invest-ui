import { createAction } from 'redux-actions'
import { InvestConfiguration } from 'invest-types'

export interface SetConfigurationPayload {
    configuration: InvestConfiguration
}

export enum Actions {
    SET_CONFIGURATION = 'CONFIGURATION_SET'
}

export const actionCreators = {
    setConfiguration: createAction<SetConfigurationPayload>(Actions.SET_CONFIGURATION)
}