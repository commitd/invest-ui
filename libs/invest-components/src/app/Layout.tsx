import * as React from 'react'

const drawerWidth = 200

export interface Props {
  /** Navbar at the top */
  navBar?: React.ReactElement<{}>,
  /** Side bar (optional) */
  sideBar?: React.ReactElement<{}>,
  /** whether the sidebar is open or not */
  open: boolean
}

/** A classical left sidebar, top navbar and then main content 
 * area 9which is former of the React.children). The sidebar 
 * many be open or closed 
 */
class Layout extends React.Component<Props> {
  render() {
    const { children, open, sideBar, navBar } = this.props

    const displaySideBar = open && sideBar != null

    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          margin: '0',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          // HACK
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: '100%'
          }}
        >
          {navBar}
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          {displaySideBar && <div
            style={{
              height: '100%',
              flex: `0 0 ${drawerWidth}px`,
              overflow: 'auto'
            }}
          >
            {sideBar}
          </div>}
          <div
            style={{
              flex: 1,
              height: '100%',
              margin: 0,
              padding: 0,
              border: 0
            }}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
}

export default Layout as React.ComponentType<Props>
