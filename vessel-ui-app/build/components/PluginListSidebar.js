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
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Icon from 'material-ui/Icon';
// TODO: Highlight the selected plugin
// TODO: How can the icons best work?
var PluginListSidebar = (function (_super) {
    __extends(PluginListSidebar, _super);
    function PluginListSidebar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PluginListSidebar.prototype.render = function () {
        var _a = this.props, plugins = _a.plugins, onPluginSelected = _a.onPluginSelected;
        return (React.createElement(List, { dense: true }, plugins.map(function (p) { return (React.createElement(ListItem, { key: p.id, button: true, onClick: function () { return onPluginSelected(p); } },
            React.createElement(ListItemIcon, null,
                React.createElement(Icon, null, p.icon || 'add_circle')),
            React.createElement(ListItemText, { primary: p.name, secondary: p.description }))); })));
    };
    return PluginListSidebar;
}(React.Component));
export default PluginListSidebar;
//# sourceMappingURL=PluginListSidebar.js.map