import { InvestConfiguration } from 'invest-types'
import { observable } from 'mobx'

export default class ConfigurationStore {
  @observable
  configuration: InvestConfiguration = {
    title: 'Invest',
    serverUrl: 'http://localhost:8080',
    settings: {}
  }
}
