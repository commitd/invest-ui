import { InvestUiGraphQLRoot, NavigateInput, QueryActionInput } from 'invest-framework'
import InvestUiResolverStore from '../stores/InvestUiResolverStore'

export function createGraphQLResolver(investUiResolverStore: InvestUiResolverStore): InvestUiGraphQLRoot {
  const simpleRoot: InvestUiGraphQLRoot = {
    query: {
      investUi: {
        status: () => dispatchAsAction(dispatch, RootAction.actionCreators.investUi.status, {}),
        actions: (args: { input: QueryActionInput }) =>
          dispatchAsAction(dispatch, RootAction.actionCreators.investUi.actions, args.input)
      }
    },
    mutation: {
      investUi: {
        navigate: (args: { input: NavigateInput }) =>
          dispatchAsAction(dispatch, RootAction.actionCreators.investUi.navigate, args.input)
      }
    }
  }
  return simpleRoot
}
