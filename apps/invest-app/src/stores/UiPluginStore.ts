import { UiPlugin } from 'invest-types'
import { observable } from 'mobx'

export default class UiPluginStore {
  @observable uiPlugins: UiPlugin[] = []
}
