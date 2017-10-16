import { combineReducers } from 'redux'

import * as Test from './reducers/example'

interface StoreEnhancerState { }

export interface RootState extends StoreEnhancerState {
    test: Test.State
}

export const rootReducer = combineReducers<RootState>({
    test: Test.reducer
})