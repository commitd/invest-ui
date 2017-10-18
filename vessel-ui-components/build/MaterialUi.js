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
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
var MaterialUi = (function (_super) {
    __extends(MaterialUi, _super);
    function MaterialUi(props) {
        var _this = _super.call(this, props) || this;
        _this.theme = createMuiTheme(_this.props.theme);
        return _this;
    }
    MaterialUi.prototype.render = function () {
        return (React.createElement(MuiThemeProvider, { theme: this.theme }, this.props.children));
    };
    MaterialUi.defaultProps = {
        theme: {}
    };
    return MaterialUi;
}(React.Component));
export default MaterialUi;
//# sourceMappingURL=MaterialUi.js.map