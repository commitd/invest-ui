import { createStore, applyMiddleware, Reducer, Store, compose, Middleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

// In effect redeclaring Saga0 from redux-saga here
export type RootSaga = () => Iterator<{}>

const composeEnhancers = (
  process.env.NODE_ENV === 'development' &&
  window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose

function configureStore<S>(rootReducer: Reducer<S>, middleware: Middleware[], initialState?: S): Store<S> {
  return createStore<S>(
    rootReducer,
    initialState!,
    composeEnhancers(...middleware.map(m => applyMiddleware(m))
    )
  )
}

export function newStore<S>(
  rootReducer: Reducer<S>,
  rootSaga?: RootSaga,
  middleware: Middleware[] = [],
  initialState?: S
): Store<S> {
  const sagaMiddleware = createSagaMiddleware()
  const store = configureStore(rootReducer, [sagaMiddleware, ...middleware], initialState)
  if (rootSaga) {
    sagaMiddleware.run(rootSaga)
  }
  return store
}
