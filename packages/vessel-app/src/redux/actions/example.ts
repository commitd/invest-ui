import { createAction } from 'redux-actions'

export enum Actions {
    EXAMPLE_NO_PAYLOAD = 'EXAMPLE_NO_PAYLOAD',
    EXAMPLE_WITH_PAYLOAD = 'EXAMPLE_WITH_PAYLOAD',
}

export const actionCreators = {
    simpleExample: createAction(Actions.EXAMPLE_NO_PAYLOAD),
    payloadExample: createAction(
      Actions.EXAMPLE_WITH_PAYLOAD, (message: string) => ({ message }),
    ),
  }
  