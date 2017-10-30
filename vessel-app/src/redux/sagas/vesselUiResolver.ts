import { call, all, takeEvery } from 'redux-saga/effects'

import { Actions } from '../RootAction'

import { QueryActionInput, QueryActionOutput, NavigateInput, NavigateOutput, ResolverAction } from 'vessel-framework'
import { PluginActionDefinition } from 'vessel-types'
import history from '../../history'

function* handleStatus(action: ResolverAction<{}, string>) {
    yield call(action.meta.promise.resolve, 'OK')
}

function* handleQuery(action: ResolverAction<QueryActionInput, QueryActionOutput>) {
    console.log(action)
    if (action.payload == null) {
        yield call(action.meta.promise.reject, 'No payload')
        return
    }

    let definitions: PluginActionDefinition[] = []

    const requiredAction = action.payload.action
    if (requiredAction === 'documents.view') {
        definitions = [{
            action: 'documents.view',
            title: 'Mock Say Hello',
            description: 'Hello plugin sayer',
            pluginId: 'HelloUiPlugin',
            payload: {}
        }]

    } else if (requiredAction == null) {
        // TODO: Should we return everything here?
    } else {
        // definition is empty... Nothing satisties that
    }
    yield call(action.meta.promise.resolve, {
        definitions
    })
}

function* handleNavigate(action: ResolverAction<NavigateInput, NavigateOutput>) {

    if (action.payload == null) {
        yield call(action.meta.promise.reject, 'Null payload')
        return
    }

    // TODO: Should validate this is available in this store .... 
    // TODO: action and payload
    history.push('/view/' + action.payload.pluginId)

    yield call(action.meta.promise.resolve, { success: true })
}

export default function* example() {
    console.log('from saga')
    yield (all([
        yield takeEvery(Actions.vesselUi.RESOLVER_QUERY_STATUS, handleStatus),
        yield takeEvery(Actions.vesselUi.RESOLVER_QUERY_ACTIONS, handleQuery),
        yield takeEvery(Actions.vesselUi.RESOLVER_MUTATION_NAVIGATE, handleNavigate)
    ]))
}