import { all } from 'redux-saga/effects'

import vesselUiResolver from './sagas/vesselUiResolver'

export function* rootSaga() {
    console.log('rootSaga')
    yield all([
        vesselUiResolver()
    ])
}