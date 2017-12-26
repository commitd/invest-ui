import { createStore, applyMiddleware, Reducer, Store, compose, Middleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

/** Redeclaring Saga0 from redux-saga (in effect) */
export type RootSaga = () => Iterator<{}>

// Typescript doesn't know about Redux Devtools flag
type DevToolsWIndow = Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function
}

const composeEnhancers = (
  process.env.NODE_ENV === 'development' &&
  window && (<DevToolsWIndow>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose

function configureStore<S>(rootReducer: Reducer<S>, middleware: Middleware[], initialState?: S): Store<S> {
  return createStore<S>(
    rootReducer,
    initialState!,
    composeEnhancers(...middleware.map(m => applyMiddleware(m))
    )
  )
}

/**
 * Create a new store with saga middleware, using the arguments supplied
 * @param rootReducer The reducer
 * @param rootSaga The root saga to run (may be excluded in which case no sagas will be run)
 * @param middleware any additional middeware to use in this store (will be applied after saga middleware)
 * @param initialState optional intial state to push into store 
 */
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
