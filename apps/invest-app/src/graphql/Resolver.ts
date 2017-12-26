import {
    InvestUiGraphQLRoot, NavigateInput, QueryActionInput,
    dispatchAsAction
} from 'invest-framework'
import { Dispatch } from 'redux'
import { History } from 'history'

import * as RootAction from '../redux/RootAction'

export function createGraphQLResolver(dispatch: Dispatch<{}>, history: History): InvestUiGraphQLRoot {
    const simpleRoot: InvestUiGraphQLRoot = {
        query: {
            investUi: {
                status: () => dispatchAsAction(dispatch, RootAction.actionCreators.investUi.status, {}),
                actions: (args: { input: QueryActionInput }) => dispatchAsAction(
                    dispatch, RootAction.actionCreators.investUi.actions, args.input),
            }
        },
        mutation: {
            investUi: {
                navigate: (args: { input: NavigateInput }) => dispatchAsAction(
                    dispatch, RootAction.actionCreators.investUi.navigate, args.input),
            }
        }
    }
    return simpleRoot
}
