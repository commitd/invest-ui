import { action, computed, observable } from 'mobx'

export default class AuthStore {
  @observable name = 'Guest'
  @observable username?: string
  @observable session?: string
  @observable roles: string[] = []

  @observable authenticationEnabled: boolean = true

  @computed
  get authenticated() {
    return this.session != null && this.username != null
  }

  @action
  signInOnClient(username: string, session: string, roles: string[]) {
    this.name = username
    this.username = username
    this.session = session
    this.roles = roles
  }

  @action
  signOutOnClient() {
    this.name = 'Guest'
    this.username = undefined
    this.session = undefined
    this.roles = []
  }

  @action
  setAuthenticationMode(enabled: boolean) {
    this.authenticationEnabled = enabled
  }
}
