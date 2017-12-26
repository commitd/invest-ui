import * as React from 'react'
import { Connection, Handler } from 'vessel-rpc'

export interface Props<S> {
  /** The src url for the iframe */
  src: string,
  /** Hide the iframe - but don't delete it or remove from the DOM */
  hide?: boolean
  /** Handler to handle messages recieved from the iframe target window */
  handler?: Handler<S>,
  /**
   * Call back when the iframe has loaded.
   * 
   * connection will only be undefined if handler has been provided in the props
   */
  onLoad?(connection?: Connection<S>): void,
}

/**
 * Displays the src url inside an iframe.
 * 
 * The iframe is sandboxsed which allows scripts, but the same origin access (aka to the parent window).
 * 
 * Users of this component will want to consider who changes in src effect 
 * state page within.
 */
class IFrame<S> extends React.Component<Props<S>, {}>  {
  private ref: HTMLIFrameElement
  private connection: Connection<S>

  componentDidMount() {
    if (this.ref) {
      this.ref.onload = () => {
        const handler = this.props.handler
        if (handler) {
          this.connection = new Connection<S>(window, this.ref.contentWindow, handler)
          this.connection.start()
        }

        // Go async and give the frame some time to setup...
        if (this.props.onLoad) {
          const onLoad = this.props.onLoad
          // Note if a handler has not ben set then connection here will be undefined
          setTimeout(() => onLoad(this.connection), 100)
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
      style = { height: '100%', width: '100%' }
    } else {
      style = { display: 'none' }
    }

    // Note we allow:
    // - scripts as we are assume you'll be writing a JS application
    // - forms because they are fundamental to most applications (but think about cross domain issues)
    // - popups because although they are annoying they are good for major error / debugging

    return (
      <iframe
        title="View"
        sandbox="allow-scripts allow-forms allow-popups"
        src={src}
        style={style}
        ref={e => {
          // TODO: Should we start / stop / create new connections if this happens when we already have a ref?
          if (e != null) {
            this.ref = e
          }
        }}
      />
    )
  }
}

export default IFrame
