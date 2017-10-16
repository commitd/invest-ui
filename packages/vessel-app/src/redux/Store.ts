import { createStore, applyMiddleware } from 'redux'
import { rootReducer, RootState } from './RootReducer'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from './RootSaga'

import logger from '../projects/log'

const sagaMiddleware = createSagaMiddleware()

function configureStore(initialState?: RootState) {
  return createStore<RootState>(
    rootReducer,
    initialState!,
    applyMiddleware(sagaMiddleware),
  )
}

const store = configureStore()

logger.info('hello')

sagaMiddleware.run(rootSaga)

export default store