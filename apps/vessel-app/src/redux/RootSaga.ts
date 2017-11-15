import { all } from 'redux-saga/effects'

import vesselUiResolver from './sagas/vesselUiResolver'

export function* rootSaga() {
    yield all([
        vesselUiResolver()
    ])
}