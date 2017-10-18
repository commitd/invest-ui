import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
function configureStore(rootReducer, sagaMiddleware, initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware));
}
export function newStore(rootReducer, rootSaga, initialState) {
    var sagaMiddleware = createSagaMiddleware();
    var store = configureStore(rootReducer, sagaMiddleware, initialState);
    if (rootSaga) {
        sagaMiddleware.run(rootSaga);
    }
    return store;
}
//# sourceMappingURL=store.js.map