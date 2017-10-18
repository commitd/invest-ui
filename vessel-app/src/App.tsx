import * as React from 'react'
import { IFrame } from 'vessel-ui-app'

interface Props {}

interface State {
    plugins: string[],
    selectedPlugin?: string
}

class App extends React.Component<Props, State> {

  state = {
    plugins: ['HelloUiPlugin', 'graphiql'],
    selectedPlugin: undefined
  }

  componentDidMount() {
    // fetch('/core/ui', { method: 'GET' })
    //   .then(res => {
    //     return res.text()
    //   })
    //   .then(res => {
    //     this.setState({
    //       plugins: res.split('\\n')
    //     })
    //   })
  }

  render() {
    const { plugins, selectedPlugin } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Jonah</h1>
        </header>
        <ul>
          {plugins.map(p => (
            <li key={p} onClick={() => this.setState({ selectedPlugin: p })}>
              {p}
            </li>
          ))}
        </ul>

        {selectedPlugin != null ? (
          <div>
            <IFrame
              src={'http://localhost:8080/ui/' + selectedPlugin + '/index.html'}
            />
          </div>
        ) : (
          <div />
        )}
      </div>
    )
  }
}

export default App
