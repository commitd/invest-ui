import * as React from 'react'
import { Menu, Segment, Button, Icon } from 'semantic-ui-react'

export interface Props {
  /** The title to place in the bar */
  title: string,
  /** A component (typically text or dorp down menu) to put on the right hand side */
  rightArea?: React.ReactElement<{}>
  /** Call when the sidebar button is clicked... this component does not track state */
  onSideBarToggle?(): void
}

/** Top navigation bar which has open/close menu button, title and optional area on the right */
class NavBar extends React.Component<Props> {

  handleDrawerToggle = () => {
    const onSideBarToggle = this.props.onSideBarToggle
    if (onSideBarToggle) {
      onSideBarToggle()
    }
  }

  render() {
    const { title, onSideBarToggle, rightArea } = this.props

    return (
      <Menu inverted={true} style={{ borderRadius: 0 }}>
        {onSideBarToggle && <Menu.Item onClick={this.handleDrawerToggle} icon="bars" />}
        <Menu.Item name={title} />
        <Menu.Item position="right">
          {rightArea}
        </Menu.Item>
      </Menu>
    )
  }
}

export default NavBar