
import * as Auth from './reducers/auth'
import * as Plugins from './reducers/plugins'

interface StoreEnhancerState { }

export interface RootState extends StoreEnhancerState {
    auth: Auth.State,
    plugins: Plugins.State
}

export const rootReducer = {
    auth: Auth.reducer,
    plugins: Plugins.reducer
}