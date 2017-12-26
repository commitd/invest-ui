import {
  QueryActionInput, QueryActionOutput, NavigateInput, NavigateOutput,
  createResolverAction
} from 'invest-framework'

export enum Actions {
  RESOLVER_QUERY_STATUS = 'HANDLER_QUERY_STATUS',
  RESOLVER_QUERY_ACTIONS = 'HANDLER_QUERY_ACTIONS',
  RESOLVER_MUTATION_NAVIGATE = 'HANDLER_MUTATION_NAVIGATE'
}

export const actionCreators = {
  status: createResolverAction<{}, string>(Actions.RESOLVER_QUERY_STATUS),
  actions: createResolverAction<QueryActionInput, QueryActionOutput>(Actions.RESOLVER_QUERY_ACTIONS),
  navigate: createResolverAction<NavigateInput, NavigateOutput>(Actions.RESOLVER_MUTATION_NAVIGATE)
}
