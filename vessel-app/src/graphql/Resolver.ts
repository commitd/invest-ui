import {
    VesselUiGraphQLRoot, NavigateInput, QueryActionInput,
    dispatchAsAction
} from 'vessel-framework'
import { Dispatch } from 'redux'
import { History } from 'history'

import * as RootAction from '../redux/RootAction'

export function createGraphQLResolver(dispatch: Dispatch<{}>, history: History): VesselUiGraphQLRoot {
    const simpleRoot: VesselUiGraphQLRoot = {
        query: {
            vesselUi: {
                status: () => dispatchAsAction(dispatch, RootAction.actionCreators.vesselUi.status, {}),
                actions: (args: { input: QueryActionInput }) => dispatchAsAction(
                    dispatch, RootAction.actionCreators.vesselUi.actions, args.input),
            }
        },
        mutation: {
            vesselUi: {
                navigate: (args: { input: NavigateInput }) => dispatchAsAction(
                    dispatch, RootAction.actionCreators.vesselUi.navigate, args.input),
            }
        }
    }
    return simpleRoot
}
