import { createStore, applyMiddleware } from 'redux'
import { rootReducer, RootState } from './RootReducer'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from './RootSaga'

import { Logger } from 'vessel-utils'

const sagaMiddleware = createSagaMiddleware()

function configureStore(initialState?: RootState) {
  return createStore<RootState>(
    rootReducer,
    initialState!,
    applyMiddleware(sagaMiddleware),
  )
}

const store = configureStore()

Logger.info('Store created')

sagaMiddleware.run(rootSaga)

Logger.info('Sagas running')

export default store