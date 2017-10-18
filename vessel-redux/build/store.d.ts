import { Reducer, Store } from 'redux';
export declare type RootSaga = () => Iterator<{}>;
export declare function newStore<S>(rootReducer: Reducer<S>, rootSaga?: RootSaga, initialState?: S): Store<S>;
