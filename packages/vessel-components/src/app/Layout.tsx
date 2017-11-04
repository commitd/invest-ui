import * as React from 'react'
import { withStyles, WithStyles, Theme, StyleRulesCallback } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import Paper from 'material-ui/Paper'

const drawerWidth = 240

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    marginTop: 0,
    zIndex: 1,
    overflow: 'hidden'
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  hide: {
    display: 'none'
  },
  drawerPaper: {
    zIndex: 1,
    position: 'relative',
    marginTop: '56px',
    height: 'calc(100% - 56px)',
    width: drawerWidth,
    paddingTop: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      content: {
        height: 'calc(100% - 64px)',
        marginTop: 64
      }
    }
  },
  content: {
    width: '100%',
    flexGrow: 1,
    marginLeft: 0,
    backgroundColor: theme.palette.background.default,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    height: 'calc(100% - 56px)',
    marginTop: '56px',
    [theme.breakpoints.up('sm')]: {
      content: {
        height: 'calc(100% - 64px)',
        marginTop: '64px'
      }
    }
  },
  contentShift: {
    marginLeft: 0,
    // TODO: Transition does nothing has we aren't chaning margin that any more!
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  paper: {
    padding: 0,
    height: '100%',
    width: '100%'
  }
})

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
class Layout extends React.Component<Props & WithStyles> {
  render() {
    const { children, classes, open, sideBar, navBar } = this.props

    const displaySideBar = open && sideBar != null

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          {navBar}
          {displaySideBar && <Drawer
            type="persistent"
            classes={{
              paper: classes.drawerPaper
            }}
            open={displaySideBar}
          >
            <div>
              {sideBar}
            </div>
          </Drawer>
          }
          <main
            className={`${classes.content} ${displaySideBar ? classes.contentShift : ''}`}
          >
            <Paper className={classes.paper}>{children}</Paper>
          </main>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })<Props>(Layout) as React.ComponentType<Props>
