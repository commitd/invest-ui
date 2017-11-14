
import * as Auth from './reducers/auth'

interface StoreEnhancerState { }

export interface RootState extends StoreEnhancerState {
    auth: Auth.State
}

export const rootReducer = {
    auth: Auth.reducer
}