import { UiPlugin } from 'invest-types'
import AuthStore from '../stores/AuthStore'

export function canUserSeePlugin(auth: AuthStore, plugin: UiPlugin) {
  // if we aren't using authentication then of course we can carry on
  if (auth.authenticationEnabled === false) {
    return true
  }

  const userRoles = auth.roles
  const pluginRoles = plugin.roles

  if (pluginRoles) {
    // Does the user have all of the plugins roles?
    return pluginRoles.every(r => userRoles.includes(r))
  } else {
    // If the plugin has no roles, then anyone can use it
    return true
  }
}
