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
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import { withStyles } from 'material-ui/styles';
function styles(theme) {
    return ({ appBar: {
            position: 'absolute'
        },
        menuButton: {
            marginLeft: 12,
            marginRight: 20
        },
        flex: {
            flex: 1
        }
    });
}
var NavBar = (function (_super) {
    __extends(NavBar, _super);
    function NavBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavBar.prototype.render = function () {
        var _a = this.props, title = _a.title, classes = _a.classes, onDrawerToggle = _a.onDrawerToggle;
        return (React.createElement(AppBar, { className: classes.appBar },
            React.createElement(Toolbar, null,
                React.createElement(IconButton, { color: "contrast", "aria-label": "open drawer", onClick: onDrawerToggle, className: classes.menuButton },
                    React.createElement(MenuIcon, null)),
                React.createElement(Typography, { type: "title", color: "inherit", noWrap: true }, title),
                React.createElement("div", { className: classes.flex }, "\u00A0"))));
    };
    return NavBar;
}(React.Component));
export default withStyles(styles)(NavBar);
//# sourceMappingURL=NavBar.js.map