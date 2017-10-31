import * as React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import { withStyles, WithStyles, StyleRules, Theme } from 'material-ui/styles'

function styles(theme: Theme): StyleRules {
  return ({
    appBar: {
      position: 'absolute'
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 20
    },
    flex: {
      flex: 1
    }
  })
}

export interface Props {
  title: string,
  rightArea: React.ReactElement<{}>,
  onSideBarToggle?(): void
}

class NavBar extends React.Component<Props & WithStyles, {}> {

  handleDrawerToggle = () => {
    const onSideBarToggle = this.props.onSideBarToggle
    if (onSideBarToggle) {
      onSideBarToggle()
    }
  }

  render() {
    const { title, classes, onSideBarToggle, rightArea } = this.props

    return (
      <AppBar className={classes.appBar}>
        <Toolbar>
          {onSideBarToggle && <IconButton
            color="contrast"
            aria-label="open drawer"
            onClick={this.handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>}
          <Typography type="title" color="inherit" noWrap={true}>
            {title}
          </Typography>
          <div className={classes.flex}>&nbsp;</div>
          {rightArea}
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)<Props>(NavBar) as React.ComponentType<Props>
