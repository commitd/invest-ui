import { all } from 'redux-saga/effects'

import investUiResolver from './sagas/investUiResolver'

export function* rootSaga() {
    yield all([
        investUiResolver()
    ])
}