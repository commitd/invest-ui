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
    if (this.props.mutate) {
      this.props.mutate({ variables: { pluginId: 'HelloUiPlugin' } })
    }
  }

  render() {
    const things = this.props.data && this.props.data.things ? this.props.data.things : []
    return (
      <div className="App" >
        <p>Hello, got {things.length} results, with status
        {this.props.data && this.props.data.vesselUi && this.props.data.vesselUi.status}</p>
        <ul>
          {things.map(t => <li key={t.name}>{t.name}</li>)}
        </ul>
        <p><a onClick={this.handleNavigate}>Click</a> to go somewhere else</p>
      </div>
    )
  }
}

const NAVIGATE_MUTATION = gql`
mutation navigate($pluginId: String!) {
          vesselUi {
        navigate(id: $pluginId) {
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
        }
  }
`

export default compose(
  graphql<Response, {}, Props>(NAVIGATE_MUTATION),
  graphql<Response, {}, Props>(ALL_THINGS_QUERY)
)(App)
