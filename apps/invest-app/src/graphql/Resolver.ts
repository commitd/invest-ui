import { InvestUiGraphQLRoot, NavigateInput, QueryActionInput } from 'invest-framework'
import InvestUiResolverStore from '../stores/InvestUiResolverStore'

export function createGraphQLResolver(investUiResolverStore: InvestUiResolverStore): InvestUiGraphQLRoot {
  const simpleRoot: InvestUiGraphQLRoot = {
    query: {
      investUi: {
        status: () => investUiResolverStore.status(),
        actions: (args: { input: QueryActionInput }) => investUiResolverStore.actions(args.input)
      }
    },
    mutation: {
      investUi: {
        navigate: (args: { input: NavigateInput }) => investUiResolverStore.navigate(args.input)
      }
    }
  }
  return simpleRoot
}
