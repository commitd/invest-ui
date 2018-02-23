import * as InvestUiResolver from './actions/investUi'
import * as Auth from './actions/auth'
import * as Plugins from './actions/plugins'
import * as Configuration from './actions/configuration'

export const Actions = {
    investUi: InvestUiResolver.Actions,
    auth: Auth.Actions,
    plugins: Plugins.Actions,
    configuration: Configuration.Actions

}

export const actionCreators = {
    investUi: InvestUiResolver.actionCreators,
    auth: Auth.actionCreators,
    plugins: Plugins.actionCreators,
    configuration: Configuration.actionCreators
}
