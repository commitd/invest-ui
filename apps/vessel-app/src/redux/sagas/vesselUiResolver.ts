import { call, all, takeEvery, select } from 'redux-saga/effects'

import { Actions } from '../RootAction'

import { QueryActionInput, QueryActionOutput, NavigateInput, NavigateOutput, ResolverAction } from 'vessel-framework'
import { PluginActionDefinition, UiPlugin } from 'vessel-types'
import history from '../../history'
import { intentToSearch } from 'vessel-utils'
import { RootState } from '../RootReducer'
import { State as AuthState } from '../reducers/auth'

import { canUserSeePlugin } from '../../utils/RoleUtils'

function* handleStatus(action: ResolverAction<{}, string>) {
    yield call(action.meta.promise.resolve, 'OK')
}

function* handleQuery(action: ResolverAction<QueryActionInput, QueryActionOutput>) {
    if (action.payload == null) {
        yield call(action.meta.promise.reject, 'No payload')
        return
    }

    let definitions: PluginActionDefinition[] = []

    const requiredAction = action.payload.action

    if (requiredAction == null) {
        // TODO: Should we return everything here?
    } else {
        const plugins: UiPlugin[] = yield select((state: RootState) => state.plugins.uiPlugins)
        const auth: AuthState = yield select((state: RootState) => state.auth)

        plugins
            .filter(p => canUserSeePlugin(auth, p))
            .forEach(p => {
                p.actions
                    .filter(a => a.action === requiredAction)
                    .map(a => ({
                        action: a.action,
                        payload: a.payload,
                        title: a.title,
                        description: a.description,
                        pluginId: p.id
                    }))
                    .forEach(a => definitions.push(a))
            })
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

    // TODO: Should validate this plugin is available in this store ?

    const search = action.payload ? intentToSearch({
        action: action.payload.action != null ? action.payload.action : '',
        payload: action.payload.payload
    }) : ''
    const url = '/view/' + action.payload.pluginId + '?' + search

    history.push(url)

    yield call(action.meta.promise.resolve, { success: true })
}

export default function* example() {
    yield (all([
        yield takeEvery(Actions.vesselUi.RESOLVER_QUERY_STATUS, handleStatus),
        yield takeEvery(Actions.vesselUi.RESOLVER_QUERY_ACTIONS, handleQuery),
        yield takeEvery(Actions.vesselUi.RESOLVER_MUTATION_NAVIGATE, handleNavigate)
    ]))
}