import * as React from 'react'
import * as PropTypes from 'prop-types'
import { compose, graphql, gql, MutationFunc } from 'react-apollo'
import { VesselPluginApi } from 'vessel-plugin'

interface Response {
  things: {
    name: string
  }[]
  vesselUi: {
    status: string
    actions: {
      definitions: {
        pluginId: string,
        action: string,
        title: string
      }[]
    }
  }
}

interface Props {
  data: Response,
  mutate: MutationFunc<{
    success: boolean
  }>
}

interface Context {
  pluginApi: VesselPluginApi
}

class App extends React.Component<Props> {

  static contextTypes = {
    pluginApi: PropTypes.instanceOf(VesselPluginApi)
  }

  context: Context

  handleNavigate = () => {
    // Call through the props (created)
    if (this.props.mutate) {
      const pluginId = this.props.data.vesselUi.actions.definitions[0].pluginId
      this.props.mutate({
        variables: {
          pluginId: pluginId
        }
      })
    }
    // Or call directly without need: 
    // const s = gql`
    // mutation {
    //   vesselUi {
    //     navigate(pluginId:"HelloUiPlugin") {
    //       success
    //     }
    //   }
    // }
    // `
    // this.context.pluginApi.mutate({ mutation: s }).then(response => {
    //   console.log(response)
    // })
  }

  render() {
    const things = this.props.data && this.props.data.things ? this.props.data.things : []
    const actions = this.props.data && this.props.data.vesselUi && this.props.data.vesselUi.actions.definitions
    return (
      <div className="App" >
        <p>Hello, got {things.length} results, with status
        {this.props.data && this.props.data.vesselUi && this.props.data.vesselUi.status}</p>
        <ul>
          {things.map(t => <li key={t.name}>{t.name}</li>)}
        </ul>

        {actions != null
          && <p><a onClick={this.handleNavigate}>Click</a> to go view document (with {actions[0].pluginId})</p>}
      </div>
    )
  }
}

const NAVIGATE_MUTATION = gql`
mutation navigate($pluginId: String!) {
          vesselUi {
        navigate(input: {pluginId: $pluginId}) {
          success
        }
        }
}
`

const ALL_THINGS_QUERY = gql`


query AllThings {
          things {
        name
  }
  vesselUi {
          status
          actions(input: {action:"documents.view"}) {
            definitions {
              pluginId,
              action, 
              title
            }
          }
        }
  }
`

export default compose(
  graphql<Response, {}, Props>(NAVIGATE_MUTATION),
  graphql<Response, {}, Props>(ALL_THINGS_QUERY)
)(App)
