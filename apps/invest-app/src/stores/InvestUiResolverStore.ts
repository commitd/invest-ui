import { NavigateInput, NavigateOutput, QueryActionInput, QueryActionOutput } from 'invest-framework'
import { PluginActionDefinition, UiPlugin } from 'invest-types'
import { intentToSearch } from 'invest-utils'
import history from '../history'
import { canUserSeePlugin } from '../utils/RoleUtils'
import AuthStore from './AuthStore'
import UiPluginStore from './UiPluginStore'

export default class InvestUiResolverStore {
  private authStore: AuthStore
  private uiPluginStore: UiPluginStore

  constructor(authStore: AuthStore, uiPluginStore: UiPluginStore) {
    this.authStore = authStore
    this.uiPluginStore = uiPluginStore
  }

  status(): Promise<string> {
    console.log('called status')
    return Promise.resolve('OK')
  }

  actions(input?: QueryActionInput): Promise<QueryActionOutput> {
    if (!input) {
      return Promise.reject('No payload')
    }

    let definitions: PluginActionDefinition[] = []

    const requiredAction = input.action

    if (requiredAction == null) {
      // return nothing if you asked for nothing
    } else {
      const plugins: UiPlugin[] = this.uiPluginStore.uiPlugins

      plugins.filter(p => canUserSeePlugin(this.authStore, p)).forEach(p => {
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

    return Promise.resolve({
      definitions
    })
  }

  navigate(input?: NavigateInput): Promise<NavigateOutput> {
    console.log('navigate')

    if (input == null) {
      return Promise.resolve({
        success: false
      })
    }

    // TODO: We could verify the plugin ID exists here..

    const search = intentToSearch({
      action: input.action != null ? input.action : '',
      payload: input.payload
    })
    const url = '/view/' + input.pluginId + '?' + search

    history.push(url)

    return Promise.resolve({
      success: true
    })
  }
}
