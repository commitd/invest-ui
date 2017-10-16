import * as React from 'react'
import Connection, { Handler } from 'vessel-rpc'

interface Props<S> {
  src: string,
  handler: Handler<S>,
  onLoad(connection: Connection<S>): void
}

// TODO: We want some defined behaviour here which I don't think is implemented. 
// new src => new iframe => new handler, etc
// we probably need to be smarter really. For example create iframes by src but as the user navigates away just 
// hide them rather than destorying then the state is till around... 
// reducing load time and the need to worry about immediately saving any state 

class IFrame<S> extends React.Component<Props<S>, {}>  {
  private ref: HTMLIFrameElement
  private connection: Connection<S>
  
  componentDidMount() {
    if (this.ref) {
      this.ref.onload = () => {
        this.connection = new Connection<S>(window, this.ref.contentWindow, this.props.handler)
        this.connection.start()

        // Go async and give the frame some time to setup...
        setTimeout( () => this.props.onLoad(this.connection), 100)
      }
    }
  }

  componentWillUnmount() {
    this.connection.stop()
  }

  // Don't rerender because we'll drop all the state
  shouldComponentUpdate(nextProps: Props<S>) {
    return this.props.src !== nextProps.src && nextProps.src != null
  }

  render() {
    const { src } = this.props

    return (
      <div className="fullsize-iframe-container" >
        <iframe
          key={src}
          title="View"
          sandbox="allow-scripts"
          src={src}
          ref={e => {
            if (e != null) {
              // TODO: is e changed?
              this.ref = e
            } else {
              // TODO
            }
          }}
        />
      </div>
    )
  }
}

export default IFrame
