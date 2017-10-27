import * as React from 'react'
import { graphql, gql } from 'react-apollo'

interface Response {
  things: {
    name: string
  }[]
}

interface Props {
  data: Response
}

class App extends React.Component<Props> {
  render() {
    return (
      <div className="App">
        <p>Hello, got {this.props.data.things ? this.props.data.things.length : '0'} results</p>
        <ul>
          {this.props.data.things && this.props.data.things.map(t => <li key={t.name}>{t.name}</li>)}
        </ul>
      </div>
    )
  }
}

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

export default graphql<Response, {}, Props>(ALL_THINGS_QUERY)(App)
