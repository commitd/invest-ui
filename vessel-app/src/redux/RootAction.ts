import * as VesselUiResolver from './actions/vesselUi'
import * as Auth from './actions/auth'

export const Actions = {
    vesselUi: VesselUiResolver.Actions,
    auth: Auth.Actions
}

export const actionCreators = {
    vesselUi: VesselUiResolver.actionCreators,
    auth: Auth.actionCreators
}
