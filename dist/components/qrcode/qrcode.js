"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _tool = require('./tool.js');

var _tool2 = _interopRequireDefault(_tool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Qrcode = function (_wepy$page) {
    _inherits(Qrcode, _wepy$page);

    function Qrcode() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Qrcode);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Qrcode.__proto__ || Object.getPrototypeOf(Qrcode)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
            navigationBarTitleText: "绘制二维码"
        }, _this.data = {
            width: 600,
            height: 600,
            canvasId: "qrcode"
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Qrcode, [{
        key: "convertLength",


        // 计算二维码长宽以适应不同分辨率屏幕
        value: function convertLength(length) {
            return Math.round(_wepy2.default.getSystemInfoSync().windowWidth * length / 750);
        }

        // 生成二维码

    }, {
        key: "createQrcode",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
                var me;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (url) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt("return", _wepy2.default.showToast({
                                    title: "未输入URL",
                                    icon: "none"
                                }));

                            case 2:
                                me = this;

                                _tool2.default.api.draw(url, {
                                    ctx: _wepy2.default.createCanvasContext(me.canvasId),
                                    width: me.convertLength(me.width),
                                    height: me.convertLength(me.height)
                                });

                            case 4:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function createQrcode(_x) {
                return _ref2.apply(this, arguments);
            }

            return createQrcode;
        }()
    }]);

    return Qrcode;
}(_wepy2.default.page);

exports.default = Qrcode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInFyY29kZS5qcyJdLCJuYW1lcyI6WyJRcmNvZGUiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwiZGF0YSIsIndpZHRoIiwiaGVpZ2h0IiwiY2FudmFzSWQiLCJsZW5ndGgiLCJNYXRoIiwicm91bmQiLCJ3ZXB5IiwiZ2V0U3lzdGVtSW5mb1N5bmMiLCJ3aW5kb3dXaWR0aCIsInVybCIsInNob3dUb2FzdCIsInRpdGxlIiwiaWNvbiIsIm1lIiwiUVIiLCJhcGkiLCJkcmF3IiwiY3R4IiwiY3JlYXRlQ2FudmFzQ29udGV4dCIsImNvbnZlcnRMZW5ndGgiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztJQUVxQkEsTTs7Ozs7Ozs7Ozs7Ozs7MExBRWpCQyxNLEdBQVM7QUFDTEMsb0NBQXdCO0FBRG5CLFMsUUFJVEMsSSxHQUFPO0FBQ0hDLG1CQUFPLEdBREo7QUFFSEMsb0JBQVEsR0FGTDtBQUdIQyxzQkFBVTtBQUhQLFM7Ozs7Ozs7QUFNUDtzQ0FDY0MsTSxFQUFRO0FBQ2xCLG1CQUFPQyxLQUFLQyxLQUFMLENBQVdDLGVBQUtDLGlCQUFMLEdBQXlCQyxXQUF6QixHQUF1Q0wsTUFBdkMsR0FBZ0QsR0FBM0QsQ0FBUDtBQUNIOztBQUVEOzs7OztpR0FDbUJNLEc7Ozs7OztvQ0FDVkEsRzs7Ozs7aUVBQ01ILGVBQUtJLFNBQUwsQ0FBZTtBQUNsQkMsMkNBQU8sUUFEVztBQUVsQkMsMENBQU07QUFGWSxpQ0FBZixDOzs7QUFLTEMsa0MsR0FBSyxJOztBQUNYQywrQ0FBR0MsR0FBSCxDQUFPQyxJQUFQLENBQVlQLEdBQVosRUFBaUI7QUFDYlEseUNBQUtYLGVBQUtZLG1CQUFMLENBQXlCTCxHQUFHWCxRQUE1QixDQURRO0FBRWJGLDJDQUFPYSxHQUFHTSxhQUFILENBQWlCTixHQUFHYixLQUFwQixDQUZNO0FBR2JDLDRDQUFRWSxHQUFHTSxhQUFILENBQWlCTixHQUFHWixNQUFwQjtBQUhLLGlDQUFqQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTFCNEJLLGVBQUtjLEk7O2tCQUFwQnhCLE0iLCJmaWxlIjoicXJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB3ZXB5IGZyb20gXCJ3ZXB5XCI7XHJcbmltcG9ydCBRUiBmcm9tIFwiQC9jb21wb25lbnRzL3FyY29kZS90b29sLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRcmNvZGUgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xyXG5cclxuICAgIGNvbmZpZyA9IHtcclxuICAgICAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiBcIue7mOWItuS6jOe7tOeggVwiXHJcbiAgICB9O1xyXG5cclxuICAgIGRhdGEgPSB7XHJcbiAgICAgICAgd2lkdGg6IDYwMCxcclxuICAgICAgICBoZWlnaHQ6IDYwMCxcclxuICAgICAgICBjYW52YXNJZDogXCJxcmNvZGVcIlxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDorqHnrpfkuoznu7TnoIHplb/lrr3ku6XpgILlupTkuI3lkIzliIbovqjnjoflsY/luZVcclxuICAgIGNvbnZlcnRMZW5ndGgobGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQod2VweS5nZXRTeXN0ZW1JbmZvU3luYygpLndpbmRvd1dpZHRoICogbGVuZ3RoIC8gNzUwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnlJ/miJDkuoznu7TnoIFcclxuICAgIGFzeW5jIGNyZWF0ZVFyY29kZSh1cmwpIHtcclxuICAgICAgICBpZiAoIXVybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gd2VweS5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwi5pyq6L6T5YWlVVJMXCIsXHJcbiAgICAgICAgICAgICAgICBpY29uOiBcIm5vbmVcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xyXG4gICAgICAgIFFSLmFwaS5kcmF3KHVybCwge1xyXG4gICAgICAgICAgICBjdHg6IHdlcHkuY3JlYXRlQ2FudmFzQ29udGV4dChtZS5jYW52YXNJZCksXHJcbiAgICAgICAgICAgIHdpZHRoOiBtZS5jb252ZXJ0TGVuZ3RoKG1lLndpZHRoKSxcclxuICAgICAgICAgICAgaGVpZ2h0OiBtZS5jb252ZXJ0TGVuZ3RoKG1lLmhlaWdodClcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=