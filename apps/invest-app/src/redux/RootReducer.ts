
import * as Auth from './reducers/auth'
import * as Plugins from './reducers/plugins'
import * as Configuration from './reducers/configuration'

interface StoreEnhancerState { }

export interface RootState extends StoreEnhancerState {
    auth: Auth.State,
    plugins: Plugins.State,
    configuration: Configuration.State
}

export const rootReducer = {
    auth: Auth.reducer,
    plugins: Plugins.reducer,
    configuration: Configuration.reducer
}