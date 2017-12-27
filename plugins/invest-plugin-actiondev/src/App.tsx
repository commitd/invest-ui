import * as React from 'react'
import { ChildProps } from 'invest-plugin'
import { Container } from 'semantic-ui-react'
import ViewContainer from './ViewContainer'

type OwnProps = {}

type Props = OwnProps & ChildProps

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
