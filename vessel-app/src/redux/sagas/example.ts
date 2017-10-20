
import { takeLatest } from 'redux-saga/effects'

import { Actions } from '../RootAction'

function doExample() {
    // Do something
}

export default function* example() {
    yield takeLatest(Actions.example.EXAMPLE_NO_PAYLOAD, doExample)
}