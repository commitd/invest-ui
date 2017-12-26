import * as VesselUiResolver from './actions/vesselUi'
import * as Auth from './actions/auth'
import * as Plugins from './actions/plugins'

export const Actions = {
    vesselUi: VesselUiResolver.Actions,
    auth: Auth.Actions,
    plugins: Plugins.Actions
}

export const actionCreators = {
    vesselUi: VesselUiResolver.actionCreators,
    auth: Auth.actionCreators,
    plugins: Plugins.actionCreators
}
