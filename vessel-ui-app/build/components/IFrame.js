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
import Connection from 'vessel-rpc';
// TODO: We want some defined behaviour here which I don't think is implemented. 
// new src => new iframe => new handler, etc
// we probably need to be smarter really. For example create iframes by src but as the user navigates away just 
// hide them rather than destorying then the state is till around... 
// reducing load time and the need to worry about immediately saving any state 
var IFrame = (function (_super) {
    __extends(IFrame, _super);
    function IFrame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IFrame.prototype.componentDidMount = function () {
        var _this = this;
        var handler = this.props.handler;
        if (this.ref && handler) {
            this.ref.onload = function () {
                _this.connection = new Connection(window, _this.ref.contentWindow, handler);
                _this.connection.start();
                // Go async and give the frame some time to setup...
                if (_this.props.onLoad) {
                    var onLoad_1 = _this.props.onLoad;
                    setTimeout(function () { return onLoad_1(_this.connection); }, 100);
                }
            };
        }
    };
    IFrame.prototype.componentWillUnmount = function () {
        if (this.connection) {
            this.connection.stop();
        }
    };
    // Don't rerender because we'll drop all the state
    IFrame.prototype.shouldComponentUpdate = function (nextProps) {
        return this.props.src !== nextProps.src && nextProps.src != null;
    };
    IFrame.prototype.render = function () {
        var _this = this;
        var src = this.props.src;
        return (React.createElement("iframe", { key: src, title: "View", sandbox: "allow-scripts", src: src, style: { height: '100%', width: '100%' }, ref: function (e) {
                if (e != null) {
                    // TODO: is e changed?
                    _this.ref = e;
                }
                else {
                    // TODO
                }
            } }));
    };
    return IFrame;
}(React.Component));
export default IFrame;
//# sourceMappingURL=IFrame.js.map