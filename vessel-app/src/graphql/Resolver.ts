import { VesselUiGraphQLRoot } from 'vessel-framework'
import { RootState } from '../types'
import { Store } from 'redux'
import { History } from 'history'

export function createGraphQLResolver(store: Store<RootState>, history: History): VesselUiGraphQLRoot {
    const simpleRoot: VesselUiGraphQLRoot = {
        query: {
            vesselUi: {
                status: () => 'ok'
            }
        },
        mutation: {
            vesselUi: {
                navigate: function (args: { id: String }) {
                    // TODO: Should validate this is available in this store .... 
                    history.push('/view/' + args.id)
                    return { success: true }
                }
            }
        }
    }
    return simpleRoot
}
