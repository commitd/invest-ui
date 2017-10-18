import { createStore, applyMiddleware, Reducer, Store } from 'redux'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'

// In effect redeclaring Saga0 from redux-saga here
export type RootSaga = () => Iterator<{}>

function configureStore<S>(rootReducer: Reducer<S>, sagaMiddleware: SagaMiddleware<{}>, initialState?: S): Store<S> {
  return createStore<S>(
    rootReducer,
    initialState!,
    applyMiddleware(sagaMiddleware),
  )
}

export function newStore<S>(rootReducer: Reducer<S>, rootSaga?: RootSaga, initialState?: S): Store<S> {
    const sagaMiddleware = createSagaMiddleware()
    const store = configureStore(rootReducer, sagaMiddleware, initialState)
    if (rootSaga) {
        sagaMiddleware.run(rootSaga)
    } 
    return store
}
