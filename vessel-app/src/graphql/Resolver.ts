import {
    VesselUiGraphQLRoot, NavigateInput, QueryActionInput,
    dispatchAsAction
} from 'vessel-framework'
import { RootState } from '../types'
import { Store } from 'redux'
import { History } from 'history'

import * as RootAction from '../redux/RootAction'

export function createGraphQLResolver(store: Store<RootState>, history: History): VesselUiGraphQLRoot {
    const simpleRoot: VesselUiGraphQLRoot = {
        query: {
            vesselUi: {
                status: () => dispatchAsAction(store.dispatch, RootAction.actionCreators.vesselUi.status, {}),
                actions: (args: { input: QueryActionInput }) => dispatchAsAction(
                    store.dispatch, RootAction.actionCreators.vesselUi.actions, args.input),
            }
        },
        mutation: {
            vesselUi: {
                navigate: (args: { input: NavigateInput }) => dispatchAsAction(
                    store.dispatch, RootAction.actionCreators.vesselUi.navigate, args.input),
            }
        }
    }
    return simpleRoot
}
