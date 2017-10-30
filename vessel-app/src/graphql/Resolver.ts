import { VesselUiGraphQLRoot } from 'vessel-framework'
import { RootState } from '../types'
import { Store } from 'redux'
import { History } from 'history'

import { PluginActionDefinition } from 'vessel-types'

export function createGraphQLResolver(store: Store<RootState>, history: History): VesselUiGraphQLRoot {
    const simpleRoot: VesselUiGraphQLRoot = {
        query: {
            vesselUi: {
                status: () => 'ok',
                actions: function (args: { action: string }): PluginActionDefinition[] {
                    console.log(args)
                    // TODO: back off to redux store
                    const { action } = args
                    if (action === 'documents.view') {
                        return [{
                            action: 'documents.view',
                            title: 'Mock Say Hello',
                            description: 'Hello plugin sayer',
                            pluginId: 'HelloUiPlugin',
                            payload: {}
                        }]
                    } else if (action == null) {
                        // TODO: Should we return everything here?
                        return []
                    } else {
                        // Nothing satisties that
                        return []
                    }
                }
            }
        },
        mutation: {
            vesselUi: {
                navigate: function (args: { pluginId: string, action?: string, payload?: String }) {
                    // TODO: Should validate this is available in this store .... 
                    // TODO: action and payload
                    history.push('/view/' + args.pluginId)
                    return { success: true }
                }
            }
        }
    }
    return simpleRoot
}
