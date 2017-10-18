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
var PageList = (function (_super) {
    __extends(PageList, _super);
    function PageList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PageList.prototype.render = function () {
        var _a = this.props, plugins = _a.plugins, selectedPlugin = _a.selectedPlugin, onPluginSelected = _a.onPluginSelected;
        return (React.createElement(List, { dense: true }, plugins.map(function (p) { return (React.createElement(ListItem, { button: true, onClick: function () { return onPluginSelected(p); } },
            React.createElement(ListItemIcon, null,
                React.createElement(Icon, null, "add_circle")),
            React.createElement(ListItemText, { primary: p.name, secondary: p.description }))); })));
    };
    return PageList;
}(React.Component));
export default PageList;
//# sourceMappingURL=PageList.js.map