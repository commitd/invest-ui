var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
var drawerWidth = 240;
var styles = function (theme) {
    return ({
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
        drawerPaper: (_a = {
                zIndex: 1,
                position: 'relative',
                marginTop: '56px',
                height: 'calc(100% - 56px)',
                width: drawerWidth,
                paddingTop: theme.spacing.unit * 2
            },
            _a[theme.breakpoints.up('sm')] = {
                content: {
                    height: 'calc(100% - 64px)',
                    marginTop: 64
                }
            },
            _a),
        content: (_b = {
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
                marginTop: '56px'
            },
            _b[theme.breakpoints.up('sm')] = {
                content: {
                    height: 'calc(100% - 64px)',
                    marginTop: '64px'
                }
            },
            _b),
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
    });
    var _a, _b;
};
var Layout = (function (_super) {
    __extends(Layout, _super);
    function Layout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Layout.prototype.render = function () {
        var _a = this.props, children = _a.children, classes = _a.classes, open = _a.open, sideBar = _a.sideBar, navBar = _a.navBar;
        var displaySideBar = open && sideBar != null;
        return (React.createElement("div", { className: classes.root },
            React.createElement("div", { className: classes.appFrame },
                navBar,
                displaySideBar && React.createElement(Drawer, { type: "persistent", classes: {
                        paper: classes.drawerPaper
                    }, open: displaySideBar },
                    React.createElement("div", null, sideBar)),
                React.createElement("main", { className: classes.content + " " + (displaySideBar ? classes.contentShift : '') },
                    React.createElement(Paper, { className: classes.paper }, children)))));
    };
    return Layout;
}(React.Component));
export default withStyles(styles, { withTheme: true })(Layout);
//# sourceMappingURL=Layout.js.map