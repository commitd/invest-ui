import { all } from 'redux-saga/effects'

import example from './sagas/example' 

export function* rootSaga() {
    yield all([
        example
    ])
}