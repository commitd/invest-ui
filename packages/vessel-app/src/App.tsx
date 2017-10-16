import * as React from 'react'
import {
  Route,
  Link
} from 'react-router-dom'

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Vessel</h2>
        </div>

        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Link to="/about">Go to about page</Link>
        <Route path="/about" component={() => <p>On the about page</p>} />
      </div>
    )
  }
}

export default App
