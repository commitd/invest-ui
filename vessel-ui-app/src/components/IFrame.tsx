import * as React from 'react'
import { Connection, Handler } from 'vessel-rpc'

export interface Props<S> {
  src: string,
  hide?: boolean
  handler?: Handler<S>,
  onLoad?(connection: Connection<S>): void,
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
    const handler = this.props.handler
    if (this.ref && handler) {
      this.ref.onload = () => {
        console.log('onload')
        this.connection = new Connection<S>(window, this.ref.contentWindow, handler)
        this.connection.start()

        // Go async and give the frame some time to setup...
        if (this.props.onLoad) {
          const onLoad = this.props.onLoad
          setTimeout( () => onLoad(this.connection), 100)
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.connection) {
      this.connection.stop()
    }
  }

  // Don't rerender because we'll drop all the state
  shouldComponentUpdate(nextProps: Props<S>) {
    return this.props.src !== nextProps.src && nextProps.src != null
  }

  render() {
    const { src, hide } = this.props

    let style
    if (!hide) {
      style = {height: '100%', width: '100%'}
    } else {
      style = {display: 'none'}
    }

    return (
        <iframe
          title="View"
          sandbox="allow-scripts"
          src={src}
          style={style}
          ref={e => {
            if (e != null) {
              // TODO: is e changed?
              this.ref = e
            } else {
              // TODO
            }
          }}
        />
    )
  }
}

export default IFrame
