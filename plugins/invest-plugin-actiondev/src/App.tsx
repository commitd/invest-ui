import * as React from 'react'
import { PluginProps } from 'invest-plugin'
import { Container } from 'semantic-ui-react'
import ViewContainer from './ViewContainer'

type OwnProps = {}

type Props = OwnProps & PluginProps

class App extends React.Component<Props> {

  render() {
    return (
      <Container fluid={false} >
        <ViewContainer />
      </Container>
    )
  }
}

export default App
