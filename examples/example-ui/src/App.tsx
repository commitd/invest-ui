import * as React from 'react'
import * as PropTypes from 'prop-types'
import { compose, graphql, MutationFunc } from 'react-apollo'
import gql from 'graphql-tag'
import { PluginApi } from 'invest-plugin'

interface Response {
  things: {
    name: string
  }[]
  investUi: {
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
  pluginApi: PluginApi
}

export class App extends React.Component<Props> {

  static contextTypes = {
    pluginApi: PropTypes.instanceOf(PluginApi)
  }

  context: Context

  handleNavigate = () => {
    // Call through the props (created)
    if (this.props.mutate) {
      const pluginId = this.props.data.investUi.actions.definitions[0].pluginId
      this.props.mutate({
        variables: {
          pluginId: pluginId,
          action: 'document.view',
          payload: JSON.stringify({ documentId: '12345' })
        }
      })
    }
    // Or call directly without need: 
    // const s = gql`
    // mutation {
    //   investUi {
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
    const actions = this.props.data && this.props.data.investUi && this.props.data.investUi.actions.definitions
    return (
      <div className="App" >
        <p>Hello, got {things.length} results, with status
        {this.props.data && this.props.data.investUi && this.props.data.investUi.status}</p>
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
mutation navigate($pluginId: String!, $action:String, $payload: String) {
  investUi {
        navigate(input: {pluginId: $pluginId, action: $action,  payload: $payload}) {
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
  investUi {
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
